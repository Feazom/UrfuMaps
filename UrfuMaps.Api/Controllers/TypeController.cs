using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/type")]
	public class TypeController : ControllerBase
	{
		private readonly ITypeService _typeService;

		public TypeController(ITypeService typeService)
		{
			_typeService = typeService;
		}

		[HttpGet]
		public async Task<ActionResult<string[]>> Get()
		{
			var types = (await _typeService.GetTypes());
			return Ok(types);
		}
	}
}
