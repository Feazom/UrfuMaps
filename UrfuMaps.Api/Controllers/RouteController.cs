using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/route")]
	[Produces("application/json")]
	public class RouteController : ControllerBase
	{
		private readonly IRouteService _routeService;

		public RouteController(IRouteService routeService)
		{
			_routeService = routeService;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<RouteSegment>>> Get([FromQuery] int source, [FromQuery] int destination)
		{
			var route = await _routeService.GetRoute(source, destination);
			if (route is null)
			{
				NoContent();
			}
			return Ok(await _routeService.GetSegments(route!.ToArray()));
		}
	}
}
