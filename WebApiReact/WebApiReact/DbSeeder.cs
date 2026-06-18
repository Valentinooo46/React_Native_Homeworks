using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using WebApiReact.Constants;
using WebApiReact.Data;
using WebApiReact.Entities.Chat;
using WebApiReact.Entities.Identity;
using WebApiReact.Interfaces;
using WebApiReact.Mapper;
using WebApiReact.Models.Seeder;

namespace WebApiReact;

public static class DbSeeder
{
    public static async Task SeedData(this WebApplication webApplication)
    {
        using var scope = webApplication.Services.CreateScope();
        //Цей об'єкт буде верта посилання на конткетс, який зараєстрвоано в Progran.cs
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();
        var userMapper = scope.ServiceProvider.GetRequiredService<UserMapper>();

        context.Database.Migrate();

        if (!context.Roles.Any())
        {
            foreach (var roleName in Roles.AllRoles)
            {
                var result = await roleManager.CreateAsync(new(roleName));
                if (!result.Succeeded)
                {
                    Console.WriteLine("Error Create Role {0}", roleName);
                }
            }
        }
        if (!context.Users.Any())
        {
            var imageService = scope.ServiceProvider.GetRequiredService<IImageService>();
            var jsonFile = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "JsonData", "Users.json");
            if (File.Exists(jsonFile))
            {
                var jsonData = await File.ReadAllTextAsync(jsonFile);
                try
                {
                    var users = JsonSerializer.Deserialize<List<UserSeederModel>>(jsonData);
                    foreach (var user in users)
                    {
                        //var entity = mapper.Map<UserEntity>(user);
                        var entity = userMapper.UserSeederToUser(user);
                        //var entity = new UserEntity
                        //{
                        //    Email = user.Email,
                        //    UserName = user.Email,
                        //    FirstName = user.FirstName,
                        //    LastName = user.LastName
                        //};
                        entity.Image = await imageService.SaveImageFromUrlAsync(user.ImagePath);
                        var result = await userManager.CreateAsync(entity, user.Password);
                        if (!result.Succeeded)
                        {
                            Console.WriteLine("Error Create User {0}", user.Email);
                            continue;
                        }
                        foreach (var role in user.Roles)
                        {
                            if (await roleManager.RoleExistsAsync(role))
                            {
                                await userManager.AddToRoleAsync(entity, role);
                            }
                            else
                            {
                                Console.WriteLine("Not Found Role {0}", role);
                            }
                        }
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error Json Parse Data {0}", ex.Message);
                }
            }
            else
            {
                Console.WriteLine("Not Found File Users.json");
            }
        }

        if (!context.ChatTypes.Any())
        {
            var types = ChatTypes.All
                .Select(x => new ChatTypeEntity
                {
                    TypeName = x
                }).ToList();

            context.ChatTypes.AddRange(types);
            await context.SaveChangesAsync();
        }
    }
}

