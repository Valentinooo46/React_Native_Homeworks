using WebApiReact.Smtp;

namespace WebApiReact.Interfaces;

public interface ISmtpService
{
    Task<bool> SendEmailAsync(MyEmailMessage message);
}
