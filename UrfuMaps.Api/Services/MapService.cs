using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Services
{
	public class MapService : IMapService
	{
		private readonly AppDbContext _db;

		public MapService(AppDbContext context)
		{
			_db = context;
		}

		public async Task Add(FloorDTO floorRequest)
		{
			var scheme = floorRequest.ToScheme();
			
			if (scheme != null && scheme.Positions.Count != 0)
				_db.Floors.Add(floorRequest.ToScheme());
			await _db.SaveChangesAsync();
		}

		public async Task<FloorDTO?> GetScheme(int floor, string building)
		{
			var floorScheme = await _db.Floors
				.Where(n => n.Floor == floor && n.BuildingName == building)
				.Include(n => n.Positions)
				.FirstOrDefaultAsync();

			if (floorScheme == null || floorScheme.Positions.Count == 0)
			{
				return null;
			}

			return floorScheme.ToDTO();
		}
	}
}
