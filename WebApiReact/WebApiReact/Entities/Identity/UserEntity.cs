using Microsoft.AspNetCore.Identity;

namespace WebApiReact.Entities.Identity;

public class UserEntity : IdentityUser<long>
{
    public bool IsDeleted { get; set; } = false;
    public DateTime DateCreated { get; set; } = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string? Image { get; set; } = string.Empty;
    public ICollection<UserRoleEntity>? UserRoles { get; set; }
   
}
