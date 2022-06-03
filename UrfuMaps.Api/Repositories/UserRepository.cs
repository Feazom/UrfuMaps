using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public interface IUserRepository
	{
		public ValueTask<User> Find(string login);
		public Task Add(User user);
	}

	public class UserRepository : Repository, IUserRepository
	{
		public UserRepository(AppDbContext context) : base(context) { }

		public Task Add(User user)
		{
			_context.Users.Add(user);
			return _context.SaveChangesAsync();
		}

		public ValueTask<User> Find(string login)
		{
			return _context.Users.FindAsync(login);
		}
	}
}
