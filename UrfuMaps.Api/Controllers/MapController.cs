using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/map")]
	public class MapController : ControllerBase
	{
		private readonly IMapService _mapService;

		public MapController(IMapService mapService)
		{
			_mapService = mapService;
		}

		[HttpGet]
		public async Task<ActionResult<FloorDTO>> Get([FromQuery] int floor, [StringLength(10)] string building)
		{
			var response = await _mapService.GetScheme(floor, building);

			if (response == null)
			{
				return NoContent();
			}

			return Ok(response);
		}

		[Authorize]
		[HttpPost]
		public async Task<ActionResult<FloorDTO>> PostMap([FromBody] FloorDTO floor)
		{
			if (floor.BuildingName == null || floor.Floor == null)
			{
				return BadRequest();
			}

			var scheme = await _mapService.GetScheme(floor.Floor.Value, floor.BuildingName);
			if (scheme != null)
			{
				return BadRequest(new { message = "duplicate schemes" });
			}

			await _mapService.Add(floor);
			return Ok(floor);
		}

		[Authorize]
		[Route("/image")]
		[HttpPost]
		public async Task<ActionResult> PostImage([FromForm] IFormFile file)
		{
			if (file.Length <= 0)
			{
				return BadRequest(new { messege = "empty file" });
			}

			var imageLink = $"{HttpContext.Request.Host.Value}/{file.FileName}";

			var filePath = Path.Combine("./wwwroot", file.FileName);
			using (var stream = System.IO.File.Create(filePath))
			{
				await file.CopyToAsync(stream);
			}

			return Ok(new { link = imageLink });
		}
	}
}
