namespace WebApiReact.Smtp;

public class MyEmailMessage
{
    /// <summary>
    /// Тема листа
    /// </summary>
    public string Subject { get; set; } = String.Empty;
    /// <summary>
    /// Тіло листа
    /// </summary>
    public string Body { get; set; } = String.Empty;
    /// <summary>
    /// Кому надсилаємо
    /// </summary>
    public string To { get; set; } = String.Empty;
}
