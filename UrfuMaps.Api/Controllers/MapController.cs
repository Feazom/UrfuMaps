using Microsoft.AspNetCore.Mvc;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/map")]
	public class MapController : ControllerBase
	{
		[HttpGet]
		public ActionResult<FloorScheme> Get([FromQuery] int? floor, string building)
		{
			if (floor == null || building == null)
			{
				return BadRequest();
			}
			var imageLink = HttpContext.Request.Host.Value + "/template.png";
			return Ok(new FloorScheme[]
			{
				new FloorScheme
				{
					Name = building,
					Floor = floor.Value,
					ImageLink = imageLink,
					Positions = new Position[]
					{
						new Position
						{
							Cabinet = "RI - 001",
							X = 10,
							Y = 10
						}
					}
				}
			});
		}
	}
}
