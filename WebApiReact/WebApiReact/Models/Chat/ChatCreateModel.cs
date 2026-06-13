namespace WebApiReact.Models.Chat;

public class ChatCreateModel
{
    public string? Name { get; set; }
    public long ChatTypeId { get; set; }
    public List<long> UserIds { get; set; } = [];
}
