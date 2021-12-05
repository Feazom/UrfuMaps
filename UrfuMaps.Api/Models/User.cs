using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class User
	{
		public User(string login, string password)
		{
			Login = login;
			Password = password;
		}

		[Key]
		[Required]
		public string Login { get; set; }
		[Required]
		public string Password { get; set; }
	}
}
