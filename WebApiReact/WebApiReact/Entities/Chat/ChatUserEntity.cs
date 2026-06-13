using System.ComponentModel.DataAnnotations.Schema;
using WebApiReact.Entities.Identity;

namespace WebApiReact.Entities.Chat;

[Table("tbl_chat_users")]
public class ChatUserEntity
{
    public long ChatId { get; set; }
    public ChatEntity? Chat { get; set; }

    public long UserId { get; set; }
    public UserEntity? User { get; set; }

    public bool IsAdmin { get; set; } = false;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
 