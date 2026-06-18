using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApiReact.Entities.Identity;
using WebApiReact.Interfaces;
using WebApiReact.Mapper;
using WebApiReact.Models.Account;

namespace WebApiReact.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class AccountController(IJwtTokenService jwtTokenService,
    UserManager<UserEntity> userManager,
    IImageService imageService,
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
        if (result.Succeeded)
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

}
