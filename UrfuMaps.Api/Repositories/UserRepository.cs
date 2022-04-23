using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
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
