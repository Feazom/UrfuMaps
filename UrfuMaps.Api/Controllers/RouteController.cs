using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/route")]
	public class RouteController : ControllerBase
	{
		private readonly IRouteService _routeService;

		public RouteController(IRouteService routeService)
		{
			_routeService = routeService;
		}

		[HttpGet]
		public async Task<IEnumerable<string>> Get([FromQuery] string source, [FromQuery] string destination)
		{
			var route = await _routeService.GetRoute(source, destination);
			if (route == null)
			{
				NoContent();
			}
			return route!;
		}
	}
}
