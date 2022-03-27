using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/info")]
	public class InfoController : ControllerBase
	{
		private readonly AppDbContext _db;

		public InfoController(AppDbContext dbContext)
		{
			_db = dbContext;
		}

		[HttpGet]
		public async Task<ActionResult<InfoDTO[]>> Get()
		{
			var floors = await _db.Floors
				.Select(n => new FloorInfo { BuildingName = n.BuildingName, FloorNumber = n.FloorNumber!.Value })
				.AsNoTracking()
				.ToArrayAsync();

			var result = floors.GroupBy(n => n.BuildingName)
				.Select(n => new InfoDTO
				{
					BuildingName = n.Key,
					FloorList = n.Select(x => x.FloorNumber)
				});

			return Ok(result);
		}
	}
}
