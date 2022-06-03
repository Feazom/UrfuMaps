using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/user")]
	[Produces("application/json")]
	public class UserController : ControllerBase
	{
		[Authorize]
		[HttpGet]
		public ActionResult UserDashboard()
		{
			return Ok();
		}
	}
}
