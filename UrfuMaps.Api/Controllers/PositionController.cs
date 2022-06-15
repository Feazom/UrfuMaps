using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/position")]
	[Produces("application/json")]
	public class PositionController : ControllerBase
	{
		private readonly IPositionService _positionService;

		public PositionController(IPositionService positionService)
		{
			_positionService = positionService;
		}

		[HttpGet]
		public async Task<ActionResult<PositionDTO>> Get([FromQuery] string name)
		{
			var result = await _positionService.GetPosition(name);
			if (result is null)
			{
				return NoContent();
			}
			return Ok(result);
		}
	}
}
