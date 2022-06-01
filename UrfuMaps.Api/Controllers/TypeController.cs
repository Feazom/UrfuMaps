using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/type")]
	[Produces("application/json")]
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
