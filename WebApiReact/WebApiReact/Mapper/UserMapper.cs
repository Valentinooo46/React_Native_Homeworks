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

    [MapProperty(nameof(UserSeederModel.Email), nameof(UserEntity.UserName))]
    public partial UserEntity RegisterModelToUser(RegisterModel model);

}
