using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Globalization;
using System.Security.Cryptography;
using WebApiReact.Entities.Identity;
using WebApiReact.Interfaces;
using WebApiReact.Mapper;
using WebApiReact.Models.Account;
using WebApiReact.Smtp;

namespace WebApiReact.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class AccountController(IJwtTokenService jwtTokenService,
    UserManager<UserEntity> userManager,
    IImageService imageService,
    IIdentityService identityService,
    ISmtpService smtpService,
    UserMapper userMapper) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        //this.Request
        var user = await userManager.FindByEmailAsync(model.Email);
        if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
        {
            var token = await jwtTokenService.CreateTokenAsync(user);
            return Ok(new { Token = token });
        }
        return Unauthorized("Invalid email or password");
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Register([FromForm] RegisterModel model)
    {
        var user = await userManager.FindByEmailAsync(model.Email);
        if (user != null)
        {
            return BadRequest("Email is already in use");
        }

        user = userMapper.RegisterModelToUser(model);
        if (model.ImageFile != null)
        {
            var imageUrl = await imageService.SaveImageAsync(model.ImageFile);
            user.Image = imageUrl;
        }

        var result = await userManager.CreateAsync(user, model.Password);
        if(result.Succeeded)
        {
            result = await userManager.AddToRoleAsync(user, Constants.Roles.User);
            var token = await jwtTokenService.CreateTokenAsync(user);
            return Ok(new { Token = token });
        }
        return BadRequest(result);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var email = User.Claims.First()?.Value;
        var user = await userManager.FindByEmailAsync(email);
        MeModel me = userMapper.UserToMeModel(user);
        return Ok(me);
    }

    [HttpPut]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> EditProfile([FromForm] EditProfileModel model)
    {
        try
        {
            var userId = await identityService.GetUserIdAsync();

            var user = await userManager.FindByIdAsync(Convert.ToString(userId));

            if (user == null)
                throw new Exception("User not found");

            user.LastName = model.LastName;
            user.FirstName = model.FirstName;
            user.Email = model.Email;
            user.UserName = model.Email;

            if (model.ImageFile != null)
            {
                if (!string.IsNullOrEmpty(user.Image))
                    await imageService.DeleteImageAsync(user.Image);

                user.Image = await imageService.SaveImageAsync(model.ImageFile);
            }
            await userManager.UpdateAsync(user);

            var token =  await jwtTokenService.CreateTokenAsync(user);
            return Ok(new
            {
                Token = token
            });
        }
        catch (Exception e)
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Email = e.Message }
            });
        }
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
    {

        var user = await userManager
            .Users
            .FirstOrDefaultAsync(x => x.Email == model.Email && !x.IsDeleted);

        if (user == null)
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Email = "Користувача з такою поштою не існує" }
            });
        }

        var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

        var expiresAtUtc = DateTime.UtcNow.AddMinutes(15);
        var tokenValue = $"{code}:{expiresAtUtc:o}";

        await userManager.SetAuthenticationTokenAsync(
            user,
            "PasswordReset",
            "ResetCode",
            tokenValue);

        var emailModel = new MyEmailMessage
        {
            To = model.Email,
            Subject = "Password Reset",
            Body = $@"<!DOCTYPE html>
            <html lang=""uk"">
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <title>Відновлення пароля</title>
                </head>
                <body style=""margin:0; padding:0; background-color:#000000; font-family:Arial,sans-serif; color:white;"">
                    <div style=""max-width:600px; margin:0 auto; padding:40px 20px; text-align:center;"">

                        <h1 style=""font-size:28px; font-weight:bold; text-transform:uppercase; margin-bottom:16px;"">
                            Відновлення <span style=""color:#22c55e;"">пароля</span>
                        </h1>

                        <p style=""font-size:16px; color:#d1d5db; margin-bottom:32px;"">
                            Ми отримали запит на відновлення пароля для вашого акаунта.
                            Використайте наведений нижче код для зміни пароля в застосунку.
                        </p>

                        <div style=""font-size:32px; font-weight:bold; letter-spacing:8px; margin-bottom:24px;"">
                            {code}
                        </div>

                        <p style=""font-size:12px; color:#9ca3af; margin-top:24px;"">
                            Якщо ви не запитували відновлення пароля, просто ігноруйте цей лист.
                        </p>

                        <p style=""font-size:12px; color:#6b7280; margin-top:32px;"">
                            © 2026 Chat System. Всі права захищені.
                        </p>

                    </div>
                </body>
            </html>"
        };

        var result = await smtpService.SendEmailAsync(emailModel);

        if (result)
            return Ok();
        else
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Email = "Користувача з такою поштою не існує" }
            });
    }


    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
    {
        var user = await userManager.Users
            .FirstOrDefaultAsync(x => x.Email == model.Email && !x.IsDeleted);

        if (user is null)
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Code = "Невірний або прострочений код відновлення паролю" }
            });
        }

        var storedToken = await userManager.GetAuthenticationTokenAsync(
            user,
            "PasswordReset",
            "ResetCode");

        if (string.IsNullOrWhiteSpace(storedToken))
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Code = "Невірний або прострочений код відновлення паролю" }
            });
        }

        var parts = storedToken.Split(':', 2);
        if (parts.Length != 2)
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Code = "Невірний або прострочений код відновлення паролю" }
            });
        }

        var storedCode = parts[0];
        var expiresAtString = parts[1];

        if (!string.Equals(storedCode, model.Code, StringComparison.Ordinal))
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Code = "Невірний або прострочений код відновлення паролю" }
            });
        }

        if (!DateTime.TryParse(
                expiresAtString,
                null,
                DateTimeStyles.RoundtripKind,
                out var expiresAtUtc))
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Code = "Невірний або прострочений код відновлення паролю" }
            });
        }

        if (expiresAtUtc < DateTime.UtcNow)
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Code = "Невірний або прострочений код відновлення паролю" }
            });
        }

        user.PasswordHash = userManager.PasswordHasher.HashPassword(user, model.NewPassword);

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Code = "Невірний або прострочений код відновлення паролю" }
            });
        }

        await userManager.RemoveAuthenticationTokenAsync(
            user,
            "PasswordReset",
            "ResetCode");

        return Ok();
    }
}
