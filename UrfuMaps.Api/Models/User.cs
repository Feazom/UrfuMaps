using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class User
	{
		[Key]
		[Required]
		public string Login { get; set; }
		[Required]
		public string Password { get; set; }
	}
}
