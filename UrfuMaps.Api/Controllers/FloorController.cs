using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/floor")]
	[Produces("application/json")]
	public class FloorController : ControllerBase
	{
		private readonly IMapService _mapService;

		public FloorController(IMapService mapService)
		{
			_mapService = mapService;
		}

		[HttpGet]
		public async Task<ActionResult<FloorDTO>> Get([FromQuery] int floor, [StringLength(10)] string building)
		{
			var result = await _mapService.GetScheme(floor, building);

			if (result is null)
			{
				return NoContent();
			}

			return Ok(result);
		}

		[Authorize]
		[HttpPost]
		public async Task<ActionResult> PostMap([FromBody] CreateFloorDTO floor)
		{
			if (floor.BuildingName == null || floor.FloorNumber == null)
			{
				return BadRequest();
			}

			var scheme = await _mapService.GetScheme(floor.FloorNumber.Value, floor.BuildingName);
			if (scheme != null)
			{
				return BadRequest(new { message = "duplicate schemes" });
			}

			return await _mapService.Create(floor) switch
			{
				CreateResult.Completed => Ok(),
				CreateResult.Duplicate => Conflict(),
				CreateResult.BadArgument => BadRequest(),
				_ => throw new Exception()
			};
		}

		[Authorize]
		[HttpDelete]
		public async Task<ActionResult<FloorDTO>> DeleteMap([FromQuery] int floor, [StringLength(10)] string building)
		{
			await _mapService.Delete(floor, building);
			return Ok(floor);
		}
	}
}
