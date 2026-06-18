namespace WebApiReact.Interfaces;

public interface IIdentityService
{
    Task<long> GetUserIdAsync();
}
