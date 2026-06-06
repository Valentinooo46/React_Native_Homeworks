using Microsoft.AspNetCore.Mvc;

namespace WebApiReact.Models.Account;

public class RegisterModel
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    [FromForm]
    public IFormFile? ImageFile { get; set; } = null;
}
