using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApiReact.Entities.Chat;

[Table("tbl_chats")]
public class ChatEntity : BaseEntity<long>
{
    [StringLength(50)]
    public string? Name { get; set; }

    // Тип чату, група чи приватний
    public long ChatTypeId { get; set; }
    public ChatTypeEntity? ChatType { get; set; }

    // Список користувачів в чаті
    public virtual ICollection<ChatUserEntity>? ChatUsers { get; set; }

    // Список повідомлень в чаті
    public virtual ICollection<ChatMessageEntity>? Messages { get; set; }
}
