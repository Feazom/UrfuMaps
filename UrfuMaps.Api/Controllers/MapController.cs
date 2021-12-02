using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UrfuMapsApi.Models;

namespace UrfuMapsApi.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class MapController : ControllerBase
	{
		private readonly ILogger<MapController> _logger;

		public MapController(ILogger<MapController> logger)
		{
			_logger = logger;
		}

		[HttpGet]
		public Building Get()
		{
			var b = HttpContext;
			var imageLink = HttpContext.Request.Host.Value + "/template.png";
			return new Building
			{
				Name = "RTF",
				Floors = new FloorScheme[]
				{
					new FloorScheme
					{
						Floor = 1,
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
				}
			};
		}
	}
}
