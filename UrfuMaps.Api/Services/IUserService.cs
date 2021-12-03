using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Services
{
	public interface IUserService
	{
		Task<User> Authenticate(User user);
		Task Register(User user);
		string GenerateJWT(User user);
	}
}
