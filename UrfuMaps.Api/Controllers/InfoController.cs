﻿using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/info")]
	[Produces("application/json")]
	public class InfoController : ControllerBase
	{
		private readonly IInfoService _infoService;

		public InfoController(IInfoService infoService)
		{
			_infoService = infoService;
		}

		[HttpGet]
		public async Task<ActionResult<InfoDTO[]>> Get()
		{
			var result = await _infoService.GetInfo();

			return Ok(result);
		}
	}
}
