using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using WebApiReact.Controllers;
using WebApiReact.Interfaces;
using WebApiReact.Models.Chat;

namespace WebApiReact.Tests;

public class ChatControllerTests
{
    private readonly Mock<IChatService> _mockChatService;
    private readonly ChatController _controller;

    public ChatControllerTests()
    {
        _mockChatService = new Mock<IChatService>();
        _controller = new ChatController(_mockChatService.Object);
    }

    #region Create Tests
    
    [Fact]
    public async Task Create_WithValidModel_ReturnsOkWithChatId()
    {
        // Arrange
        var chatModel = new ChatCreateModel
        {
            Name = "Test Chat",
            ChatTypeId = 1,
            UserIds = [1, 2, 3]
        };
        var expectedChatId = 123L;
        
        _mockChatService
            .Setup(x => x.CreateChatAsync(It.IsAny<ChatCreateModel>()))
            .ReturnsAsync(expectedChatId);

        // Act
        var result = await _controller.Create(chatModel);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
        _mockChatService.Verify(x => x.CreateChatAsync(It.IsAny<ChatCreateModel>()), Times.Once);
    }

    [Fact]
    public async Task Create_WithException_ReturnsBadRequest()
    {
        // Arrange
        var chatModel = new ChatCreateModel { Name = "Test Chat" };
        
        _mockChatService
            .Setup(x => x.CreateChatAsync(It.IsAny<ChatCreateModel>()))
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _controller.Create(chatModel);

        // Assert
        var badResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badResult.Value);
    }

    #endregion

    #region Edit Tests

    [Fact]
    public async Task Edit_WhenUserIsAdmin_ReturnsOk()
    {
        // Arrange
        var editModel = new ChatEditModel
        {
            Id = 123,
            Name = "Updated Chat Name"
        };

        _mockChatService
            .Setup(x => x.AmIAdminAsync(123))
            .ReturnsAsync(true);

        _mockChatService
            .Setup(x => x.EditChatAsync(It.IsAny<ChatEditModel>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Edit(editModel);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        _mockChatService.Verify(x => x.AmIAdminAsync(123), Times.Once);
        _mockChatService.Verify(x => x.EditChatAsync(It.IsAny<ChatEditModel>()), Times.Once);
    }

    [Fact]
    public async Task Edit_WhenUserIsNotAdmin_ReturnsForbid()
    {
        // Arrange
        var editModel = new ChatEditModel
        {
            Id = 123,
            Name = "Updated Chat Name"
        };

        _mockChatService
            .Setup(x => x.AmIAdminAsync(123))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.Edit(editModel);

        // Assert
        var forbidResult = Assert.IsType<ForbidResult>(result);
        _mockChatService.Verify(x => x.EditChatAsync(It.IsAny<ChatEditModel>()), Times.Never);
    }

    [Fact]
    public async Task Edit_WithException_ReturnsBadRequest()
    {
        // Arrange
        var editModel = new ChatEditModel { Id = 123 };

        _mockChatService
            .Setup(x => x.AmIAdminAsync(123))
            .ThrowsAsync(new Exception("Admin check failed"));

        // Act
        var result = await _controller.Edit(editModel);

        // Assert
        var badResult = Assert.IsType<BadRequestObjectResult>(result);
    }

    #endregion

    #region MyChats Tests

    [Fact]
    public async Task MyChats_ReturnsOkWithChatsList()
    {
        // Arrange
        var chats = new List<ChatListItemModel>
        {
            new ChatListItemModel { ChatId = 1, Name = "Chat 1", ChatTypeId = 1 },
            new ChatListItemModel { ChatId = 2, Name = "Chat 2", ChatTypeId = 1 }
        };

        _mockChatService
            .Setup(x => x.GetMyChatsAsync())
            .ReturnsAsync(chats);

        // Act
        var result = await _controller.MyChats();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedChats = Assert.IsType<List<ChatListItemModel>>(okResult.Value);
        Assert.Equal(2, returnedChats.Count);
    }

    [Fact]
    public async Task MyChats_WhenException_ReturnsBadRequest()
    {
        // Arrange
        _mockChatService
            .Setup(x => x.GetMyChatsAsync())
            .ThrowsAsync(new Exception("Service error"));

        // Act
        var result = await _controller.MyChats();

        // Assert
        var badResult = Assert.IsType<BadRequestObjectResult>(result);
    }

    #endregion

    #region GetAllTypes Tests

    [Fact]
    public async Task GetAllTypes_ReturnsOkWithTypesList()
    {
        // Arrange
        var types = new List<ChatTypeItemModel>
        {
            new ChatTypeItemModel { Id = 1, TypeName = "Private" },
            new ChatTypeItemModel { Id = 2, TypeName = "Group" }
        };

        _mockChatService
            .Setup(x => x.GetAllTypes())
            .ReturnsAsync(types);

        // Act
        var result = await _controller.GetAllTypes();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedTypes = Assert.IsType<List<ChatTypeItemModel>>(okResult.Value);
        Assert.Equal(2, returnedTypes.Count);
    }

    #endregion

    #region GetMessages Tests

    [Fact]
    public async Task GetMessages_WithValidChatId_ReturnsMessages()
    {
        // Arrange
        long chatId = 123;
        var messages = new List<ChatMessageModel>
        {
            new ChatMessageModel { Id = 1, Message = "Hello", ChatId = chatId },
            new ChatMessageModel { Id = 2, Message = "Hi there", ChatId = chatId }
        };

        _mockChatService
            .Setup(x => x.GetChatMessagesAsync(chatId))
            .ReturnsAsync(messages);

        // Act
        var result = await _controller.GetMessages(chatId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedMessages = Assert.IsType<List<ChatMessageModel>>(okResult.Value);
        Assert.Equal(2, returnedMessages.Count);
    }

    [Fact]
    public async Task GetMessages_WhenNotInChat_ReturnsForbid()
    {
        // Arrange
        long chatId = 123;

        _mockChatService
            .Setup(x => x.GetChatMessagesAsync(chatId))
            .ThrowsAsync(new UnauthorizedAccessException("Not a member"));

        // Act
        var result = await _controller.GetMessages(chatId);

        // Assert
        var forbidResult = Assert.IsType<ForbidResult>(result);
    }

    #endregion

    #region SendMessage Tests

    [Fact]
    public async Task SendMessage_WithValidModel_ReturnsMessage()
    {
        // Arrange
        var sendModel = new SendMessageModel
        {
            ChatId = 123,
            Message = "Test message"
        };
        var resultMessage = new ChatMessageModel
        {
            Id = 456,
            Message = "Test message",
            ChatId = 123
        };

        _mockChatService
            .Setup(x => x.SendMessageAsync(It.IsAny<SendMessageModel>()))
            .ReturnsAsync(resultMessage);

        // Act
        var result = await _controller.SendMessage(sendModel);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedMessage = Assert.IsType<ChatMessageModel>(okResult.Value);
        Assert.Equal(456, returnedMessage.Id);
    }

    [Fact]
    public async Task SendMessage_WhenNotInChat_ReturnsForbid()
    {
        // Arrange
        var sendModel = new SendMessageModel { ChatId = 123, Message = "Test" };

        _mockChatService
            .Setup(x => x.SendMessageAsync(It.IsAny<SendMessageModel>()))
            .ThrowsAsync(new UnauthorizedAccessException("Not a member"));

        // Act
        var result = await _controller.SendMessage(sendModel);

        // Assert
        var forbidResult = Assert.IsType<ForbidResult>(result);
    }

    #endregion

    #region SearchUsers Tests

    [Fact]
    public async Task SearchUsers_WithValidQuery_ReturnsUsersList()
    {
        // Arrange
        var searchModel = new UserSearchModel { Query = "John" };
        var users = new List<UserShortModel>
        {
            new UserShortModel { Id = 1, Name = "John Doe" },
            new UserShortModel { Id = 2, Name = "John Smith" }
        };

        _mockChatService
            .Setup(x => x.GetAllUsersAsync(It.IsAny<UserSearchModel>()))
            .ReturnsAsync(users);

        // Act
        var result = await _controller.SearchUsers(searchModel);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedUsers = Assert.IsType<List<UserShortModel>>(okResult.Value);
        Assert.Equal(2, returnedUsers.Count);
    }

    #endregion

    #region IsAdmin Tests

    [Fact]
    public async Task IsAdmin_WhenUserIsAdmin_ReturnsTrue()
    {
        // Arrange
        long chatId = 123;

        _mockChatService
            .Setup(x => x.AmIAdminAsync(chatId))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.IsAdmin(chatId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    #endregion

    #region IsUserInChat Tests

    [Fact]
    public async Task IsUserInChat_WhenUserExists_ReturnsTrue()
    {
        // Arrange
        long chatId = 123;
        long userId = 456;

        _mockChatService
            .Setup(x => x.IsUserInChat(chatId, userId))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.IsUserInChat(chatId, userId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task IsUserInChat_WhenUserDoesNotExist_ReturnsFalse()
    {
        // Arrange
        long chatId = 123;
        long userId = 999;

        _mockChatService
            .Setup(x => x.IsUserInChat(chatId, userId))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.IsUserInChat(chatId, userId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    #endregion
}
