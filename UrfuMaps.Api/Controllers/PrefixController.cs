using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/prefix")]
	[Produces("application/json")]
	public class PrefixController : ControllerBase
	{
		private readonly IPrefixService _prefixService;

		public PrefixController(IPrefixService prefixService)
		{
			_prefixService = prefixService;
		}

		[HttpGet]
		public async Task<ActionResult<string[]>> Get()
		{
			var prefixes = (await _prefixService.GetPrefixes());
			return Ok(prefixes);
		}
	}
}
