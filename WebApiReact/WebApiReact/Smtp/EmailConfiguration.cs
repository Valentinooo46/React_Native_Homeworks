namespace WebApiReact.Smtp;

public class EmailConfiguration
{
    /// <summary>
    /// Хто відправляє листа
    /// </summary>
    public string From { get; set; } = string.Empty;
    /// <summary>
    /// Сервер smtp
    /// </summary>
    public string SmtpServer { get; set; } = string.Empty;
    /// <summary>
    /// Порт на сервері, на якому він працює
    /// </summary>
    public int SmtpPort { get; set; }
    /// <summary>
    /// Хто буде піключатися до SMTP серверу
    /// </summary>
    public string UserName { get; set; } = string.Empty;
    /// <summary>
    /// Пароль видає нам сам UKR.NET
    /// </summary>
    public string Password { get; set; } = string.Empty;

}
