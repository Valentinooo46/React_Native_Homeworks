using Riok.Mapperly.Abstractions;
using WebApiReact.Entities.Chat;
using WebApiReact.Entities.Identity;
using WebApiReact.Models.Chat;
namespace WebApiReact.Mapper;
public interface IChatMapper
{
    ChatEntity ToChatEntity(ChatCreateModel src, long currentUserId);
    void UpdateChatEntity(ChatEditModel src, [MappingTarget] ChatEntity dest);
    ChatTypeItemModel ToChatTypeItemModel(ChatTypeEntity src);
    UserShortModel ToUserShortModel(UserEntity src);
    ChatListItemModel ToChatListItemModel(ChatEntity src);
    ChatMessageModel ToChatMessageModel(ChatMessageEntity src);
}
