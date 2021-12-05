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
			if (floorRequest.ToScheme() != null)
			_db.Floors.Add(floorRequest.ToScheme());
			await _db.SaveChangesAsync();
		}

		public async Task<FloorDTO?> GetScheme(int floor, string building)
		{
			var floorScheme = await _db.FindAsync<FloorScheme>(floor, building);

			if (floorScheme == null || floorScheme.Positions == null)
			{
				return null;
			}

			return floorScheme.ToDTO();
		}
	}
}
