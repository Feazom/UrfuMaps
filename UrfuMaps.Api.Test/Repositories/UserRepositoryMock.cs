using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Test.Repositories
{
	public class UserRepositoryMock : IUserRepository
	{
		public List<User> Users { get; set; }

		public Task Add(User user)
		{
			var result = new TaskCompletionSource();
			if (!Users.Select(u => u.Login).Contains(user.Login))
			{
				Users.Add(new User(user.Login, user.Password));
				result.SetResult();
			}
			else
			{
				result.SetException(new Exception("duplicate"));
			}
			return result.Task;
		}

		public ValueTask<User> Find(string login)
		{
			var result = new TaskCompletionSource<User>();
			try
			{
				var user = Users
					.Where(u => u.Login == login)
					.FirstOrDefault();
				result.SetResult(user);
			}
			catch (Exception e)
			{
				result.SetException(e);
			}
			return new ValueTask<User>(result.Task);
		}
	}
}
