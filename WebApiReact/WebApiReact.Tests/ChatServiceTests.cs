using Xunit;
using Microsoft.EntityFrameworkCore;
using WebApiReact.Data;
using WebApiReact.Services;
using WebApiReact.Interfaces;
using WebApiReact.Entities.Chat;
using WebApiReact.Entities.Identity;
using WebApiReact.Models.Chat;
using WebApiReact.Mapper;
using Moq;

namespace WebApiReact.Tests;

public class ChatServiceTests
{
    private readonly AppDbContext _context;
    private readonly Mock<IIdentityService> _mockIdentityService;
    private readonly Mock<IChatMapper> _mockMapper;
    private readonly ChatService _service;

    public ChatServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("TestDb_" + Guid.NewGuid()) // окремий БД для кожного тесту
            .Options;

        _context = new AppDbContext(options);
        _mockIdentityService = new Mock<IIdentityService>();
        _mockMapper = new Mock<IChatMapper>();
        _mockMapper.Setup(x => x.ToChatEntity(It.IsAny<ChatCreateModel>(), It.IsAny<long>()))
            .Returns((ChatCreateModel model, long userId) => new ChatEntity
            {
                Id = 123,
                Name = model.Name,
                ChatTypeId = model.ChatTypeId,
                ChatUsers = model.UserIds.Append(userId).Distinct().Select(id => new ChatUserEntity
                {
                    UserId = id,
                    IsAdmin = id == userId
                }).ToList()
            });
        _service = new ChatService(
            _context,
            _mockIdentityService.Object,
            _mockMapper.Object
        );
    }

    [Fact]
    public async Task CreateChatAsync_WithValidModel_ReturnsCreatedChatId()
    {
        // Arrange
        var userId = 1L;
        var model = new ChatCreateModel
        {
            Name = "Test Chat",
            ChatTypeId = 1,
            UserIds = [2, 3]
        };

        var chatEntity = new ChatEntity
        {
            Id = 123,
            Name = "Test Chat",
            ChatTypeId = 1
        };

        _mockIdentityService
            .Setup(x => x.GetUserIdAsync())
            .ReturnsAsync(userId);

        _mockMapper
            .Setup(x => x.ToChatEntity(model, userId))
            .Returns(chatEntity);

        // Act
        var result = await _service.CreateChatAsync(model);

        // Assert
        Assert.Equal(123, result);
        Assert.True(_context.Chats.Any(c => c.Id == 123));
    }

    [Fact]
    public async Task GetAllTypes_ReturnsListOfTypes()
    {
        // Arrange
        _context.ChatTypes.AddRange(
            new ChatTypeEntity { Id = 1, TypeName = "Private" },
            new ChatTypeEntity { Id = 2, TypeName = "Group" }
        );
        await _context.SaveChangesAsync();

        _mockMapper
            .Setup(x => x.ToChatTypeItemModel(It.IsAny<ChatTypeEntity>()))
            .Returns((ChatTypeEntity e) => new ChatTypeItemModel { Id = (int)e.Id, TypeName = e.TypeName });

        // Act
        var result = await _service.GetAllTypes();

        // Assert
        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task IsUserInChat_WhenUserExists_ReturnsTrue()
    {
        // Arrange
        long chatId = 123;
        long userId = 456;

        _context.ChatUsers.Add(new ChatUserEntity { ChatId = chatId, UserId = userId });
        await _context.SaveChangesAsync();

        // Act
        var result = await _service.IsUserInChat(chatId, userId);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task IsUserInChat_WhenUserDoesNotExist_ReturnsFalse()
    {
        // Arrange
        long chatId = 123;
        long userId = 999;

        // Act
        var result = await _service.IsUserInChat(chatId, userId);

        // Assert
        Assert.False(result);
    }
}
