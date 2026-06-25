using System.ComponentModel.DataAnnotations.Schema;

namespace WebApiReact.Entities.Chat;

[Table("tbl_chat_types")]
public class ChatTypeEntity : BaseEntity<long>
{
    public string TypeName { get; set; } = string.Empty;
    public virtual ICollection<ChatEntity>? Chats { get; set; }
}

