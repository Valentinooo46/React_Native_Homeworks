using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using WebApiReact.Interfaces;
using WebApiReact.Smtp;

namespace WebApiReact.Services;

public class SmtpService : ISmtpService
{
    private readonly EmailConfiguration _config;

    public SmtpService(IOptions<EmailConfiguration> options)
    {
        _config = options.Value;
    }
    public async Task<bool> SendEmailAsync(MyEmailMessage message)
    {
        var body = new TextPart("html")
        {
            Text = message.Body
        };
        var multipart = new Multipart("mixed");
        multipart.Add(body);

        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress("ChatSystem", _config.From));
        emailMessage.To.Add(new MailboxAddress(message.To, message.To));
        emailMessage.Subject = message.Subject;

        emailMessage.Body = multipart;

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(_config.SmtpServer, _config.SmtpPort, true);
            await client.AuthenticateAsync(_config.UserName, _config.Password);
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error send EMAIL {0}", ex.Message);
            throw new Exception("Error send EMAIL "+ex.Message);
        }
        //return false;
    }
}
