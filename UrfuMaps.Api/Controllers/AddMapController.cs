using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrfuMaps.Api.Controllers
{
	[Authorize]
	[ApiController]
	[Route("/addmap")]
	public class AddMapController : ControllerBase
	{

		[HttpGet]
		public ActionResult Get()
		{
			return Ok(new { message = "hello" });
		}
	}
}
