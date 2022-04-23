using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public interface IUserRepository
	{
		public ValueTask<User> Find(string login);
		public Task Add(User user);
	}
}
