using WebApiReact.Entities.Identity;

namespace WebApiReact.Interfaces;

public interface IJwtTokenService
{
    Task<string> CreateTokenAsync(UserEntity user);
}
