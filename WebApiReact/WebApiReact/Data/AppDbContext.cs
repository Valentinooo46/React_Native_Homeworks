using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApiReact.Entities.Chat;
using WebApiReact.Entities.Identity;

namespace WebApiReact.Data;

public class AppDbContext : IdentityDbContext<
    UserEntity,
    RoleEntity,
    long,
    IdentityUserClaim<long>,
    UserRoleEntity,
    IdentityUserLogin<long>,
    IdentityRoleClaim<long>,
    IdentityUserToken<long>>
{
    public DbSet<ChatEntity> Chats { get; set; }
    public DbSet<ChatTypeEntity> ChatTypes { get; set; }
    public DbSet<ChatMessageEntity> ChatMessages { get; set; }
    public DbSet<ChatUserEntity> ChatUsers { get; set; }
    public DbSet<ChatMessageReadEntity> ChatMessageReads { get; set; }
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<UserRoleEntity>(ur =>
        {
            ur.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(r => r.RoleId)
                .IsRequired();

            ur.HasOne(ur => ur.User)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(u => u.UserId)
            .IsRequired();
        });

        // Користувачі в чатах
        builder.Entity<ChatUserEntity>(cu =>
        {
            cu.HasKey(x => new { x.ChatId, x.UserId });

            cu.HasOne(x => x.Chat)
                .WithMany(x => x.ChatUsers)
                .HasForeignKey(x => x.ChatId)
                .IsRequired();

            cu.HasOne(x => x.User)
                .WithMany(x => x.ChatUsers)
                .HasForeignKey(x => x.UserId)
                .IsRequired();
        });

        // Прочитані повідомлення
        builder.Entity<ChatMessageReadEntity>(mr =>
        {
            mr.HasKey(x => new { x.MessageId, x.UserId });

            mr.HasOne(x => x.Message)
                .WithMany(x => x.Reads)
                .HasForeignKey(x => x.MessageId)
                .IsRequired();

            mr.HasOne(x => x.User)
                .WithMany(x => x.MessageReads)
                .HasForeignKey(x => x.UserId)
                .IsRequired();
        });
    }
}
