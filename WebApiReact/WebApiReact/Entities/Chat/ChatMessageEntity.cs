using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApiReact.Entities.Identity;

namespace WebApiReact.Entities.Chat;

[Table("tbl_chat_messages")]
public class ChatMessageEntity : BaseEntity<long>
{
    [Required]
    [StringLength(1000)]
    public string Message { get; set; } = string.Empty;

    // Відправник повідомлення
    public long UserId { get; set; }
    public UserEntity? User { get; set; }

    public long ChatId { get; set; }
    public ChatEntity? Chat { get; set; }

    // URL файлу, якщо є вкладення
    [StringLength(255)]
    public string? FileUrl { get; set; }

    // Повідомлення, на яке відповідають
    public long? ReplyToMessageId { get; set; }
    public ChatMessageEntity? ReplyToMessage { get; set; }

    // Ті хто прочитав повідомлення
    public virtual ICollection<ChatMessageReadEntity>? Reads { get; set; }

    public bool IsEdited { get; set; } = false;
}
 