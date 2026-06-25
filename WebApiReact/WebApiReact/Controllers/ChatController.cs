using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApiReact.Interfaces;
using WebApiReact.Models.Chat;

namespace WebApiReact.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService chatService;
    public ChatController(IChatService chatService) => this.chatService = chatService;
    /// <summary>
    /// Создание нового чата
    /// </summary>
    /// <param name="model">Модель для создания чата</param>
    /// <returns>ID созданного чата</returns>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ChatCreateModel model)
    {
        try
        {
            var chatId = await chatService.CreateChatAsync(model);
            return Ok(new { Id = chatId });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Редактирование чата
    /// </summary>
    /// <param name="model">Модель для редактирования чата</param>
    [HttpPut]
    public async Task<IActionResult> Edit([FromBody] ChatEditModel model)
    {
        try
        {
            // Проверка, является ли пользователь администратором
            var isAdmin = await chatService.AmIAdminAsync(model.Id);
            if (!isAdmin)
            {
                return Forbid("Only chat admin can edit the chat");
            }

            await chatService.EditChatAsync(model);
            return Ok("Chat updated successfully");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Получение всех чатов текущего пользователя
    /// </summary>
    /// <returns>Список чатов пользователя</returns>
    [HttpGet]
    public async Task<IActionResult> MyChats()
    {
        try
        {
            var chats = await chatService.GetMyChatsAsync();
            return Ok(chats);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Получение всех типов чатов (группа, приватный и т.д.)
    /// </summary>
    /// <returns>Список типов чатов</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllTypes()
    {
        try
        {
            var types = await chatService.GetAllTypes();
            return Ok(types);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Получение сообщений конкретного чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <returns>Список сообщений в чате</returns>
    [HttpGet("messages/{chatId}")]
    public async Task<IActionResult> GetMessages([FromRoute]long chatId)
    {
        try
        {
            var messages = await chatService.GetChatMessagesAsync(chatId);
            return Ok(messages);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid("You are not a member of this chat");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Отправка сообщения в чат (используется через SignalR Hub в реальной реализации)
    /// </summary>
    /// <param name="model">Модель сообщения</param>
    /// <returns>Отправленное сообщение</returns>
    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageModel model)
    {
        try
        {
            var message = await chatService.SendMessageAsync(model);
            return Ok(message);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid("You are not a member of this chat");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Поиск пользователей для добавления в чат
    /// </summary>
    /// <param name="model">Модель поиска пользователей</param>
    /// <returns>Список найденных пользователей</returns>
    [HttpPost]
    public async Task<IActionResult> SearchUsers([FromBody] UserSearchModel model)
    {
        try
        {
            var users = await chatService.GetAllUsersAsync(model);
            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Проверка, является ли текущий пользователь администратором чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <returns>true если администратор, false иначе</returns>
    [HttpGet("isadmin/{chatId}")]
    public async Task<IActionResult> IsAdmin(long chatId)
    {
        try
        {
            var isAdmin = await chatService.AmIAdminAsync(chatId);
            return Ok(new { IsAdmin = isAdmin });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Проверка, является ли пользователь членом чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="userId">ID пользователя</param>
    /// <returns>true если пользователь в чате, false иначе</returns>
    [HttpGet("ismember/{chatId}/{userId}")]
    public async Task<IActionResult> IsUserInChat(long chatId, long userId)
    {
        try
        {
            var isInChat = await chatService.IsUserInChat(chatId, userId);
            return Ok(new { IsUserInChat = isInChat });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
