namespace WebApiReact.Smtp;

public class EmailConfiguration
{
    /// <summary>
    /// Хто відправляє листа
    /// </summary>
    public static string From { get; set; } = "super.novakvova@ukr.net";
    /// <summary>
    /// Сервер smtp
    /// </summary>
    public static string SmtpServer { get; set; } = "smtp.ukr.net";
    /// <summary>
    /// Порт на сервері, на якому він працює
    /// </summary>
    public static int SmtpPort { get; set; } = 2525;
    /// <summary>
    /// Хто буде піключатися до SMTP серверу
    /// </summary>
    public static string UserName { get; set; } = "super.novakvova@ukr.net";
    /// <summary>
    /// Пароль видає нам сам UKR.NET
    /// </summary>
    public static string Password { get; set; } = "9J8nMfl6V0KjsowM";

}
