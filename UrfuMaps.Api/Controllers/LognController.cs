using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/login")]
	public class LoginController : ControllerBase
	{
		private readonly IUserService _userService;

		public LoginController(IUserService userService)
		{
			_userService = userService;
		}

		[HttpPost]
		public async Task<ActionResult> Post([FromBody] User request)
		{
			var user = await _userService.Authenticate(request);

			if (user != null)
			{
				return Ok(new
				{
					Jwt_token = $"Bearer {_userService.GenerateJWT(user)}"
				});
			}

			return Forbid();
		}
	}
}
