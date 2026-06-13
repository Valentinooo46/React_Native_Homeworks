using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebApiReact.Migrations
{
    /// <inheritdoc />
    public partial class WorkingisgoodChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_chat_types",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TypeName = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_chat_types", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tbl_chats",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ChatTypeId = table.Column<long>(type: "bigint", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_chats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tbl_chats_tbl_chat_types_ChatTypeId",
                        column: x => x.ChatTypeId,
                        principalTable: "tbl_chat_types",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tbl_chat_messages",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Message = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    ChatId = table.Column<long>(type: "bigint", nullable: false),
                    FileUrl = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ReplyToMessageId = table.Column<long>(type: "bigint", nullable: true),
                    IsEdited = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_chat_messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tbl_chat_messages_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_chat_messages_tbl_chat_messages_ReplyToMessageId",
                        column: x => x.ReplyToMessageId,
                        principalTable: "tbl_chat_messages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tbl_chat_messages_tbl_chats_ChatId",
                        column: x => x.ChatId,
                        principalTable: "tbl_chats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tbl_chat_users",
                columns: table => new
                {
                    ChatId = table.Column<long>(type: "bigint", nullable: false),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    IsAdmin = table.Column<bool>(type: "boolean", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_chat_users", x => new { x.ChatId, x.UserId });
                    table.ForeignKey(
                        name: "FK_tbl_chat_users_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_chat_users_tbl_chats_ChatId",
                        column: x => x.ChatId,
                        principalTable: "tbl_chats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tbl_chat_message_reads",
                columns: table => new
                {
                    MessageId = table.Column<long>(type: "bigint", nullable: false),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_chat_message_reads", x => new { x.MessageId, x.UserId });
                    table.ForeignKey(
                        name: "FK_tbl_chat_message_reads_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_chat_message_reads_tbl_chat_messages_MessageId",
                        column: x => x.MessageId,
                        principalTable: "tbl_chat_messages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_chat_message_reads_UserId",
                table: "tbl_chat_message_reads",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_chat_messages_ChatId",
                table: "tbl_chat_messages",
                column: "ChatId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_chat_messages_ReplyToMessageId",
                table: "tbl_chat_messages",
                column: "ReplyToMessageId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_chat_messages_UserId",
                table: "tbl_chat_messages",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_chat_users_UserId",
                table: "tbl_chat_users",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_chats_ChatTypeId",
                table: "tbl_chats",
                column: "ChatTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_chat_message_reads");

            migrationBuilder.DropTable(
                name: "tbl_chat_users");

            migrationBuilder.DropTable(
                name: "tbl_chat_messages");

            migrationBuilder.DropTable(
                name: "tbl_chats");

            migrationBuilder.DropTable(
                name: "tbl_chat_types");
        }
    }
}
