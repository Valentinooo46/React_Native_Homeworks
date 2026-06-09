using Riok.Mapperly.Abstractions;
using WebApiReact.Entities.Identity;
using WebApiReact.Models.Account;
using WebApiReact.Models.Seeder;

namespace WebApiReact.Mapper;

[Mapper]
public partial class UserMapper
{
    [MapProperty(nameof(UserSeederModel.Email), nameof(UserEntity.UserName))]
    public partial UserEntity UserSeederToUser(UserSeederModel model);

    [MapProperty(nameof(RegisterModel.Email), nameof(UserEntity.UserName))]
    public partial UserEntity RegisterModelToUser(RegisterModel model);

    [MapPropertyFromSource(nameof(MeModel.DateCreated), Use = nameof(DateTimeToString))]
    [MapPropertyFromSource(nameof(MeModel.FullName), Use = nameof(GetFullName))]
    public partial MeModel UserToMeModel(UserEntity user);

    private static string GetFullName(UserEntity user)
        => $"{user.FirstName} {user.LastName}".Trim();

    private static string DateTimeToString(UserEntity user)
        => user.DateCreated.ToString("dd.MM.yyyy HH:mm:ss");

}
