using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/register")]
	public class RegisterController : ControllerBase
	{
		private readonly IUserService _userService;

		public RegisterController(IUserService userService)
		{
			_userService = userService;
		}

		[HttpPost]
		public async Task<ActionResult> Post([FromBody] User request)
		{
			await _userService.Register(request);
			return Ok();
		}
	}
}
