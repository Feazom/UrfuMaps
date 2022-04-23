using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public class FloorRepository : Repository, IFloorRepository
	{
		public FloorRepository(AppDbContext context) : base(context) { }

		public async Task<int?> Add(Floor floor)
		{
			var newFloor = (Floor)floor.Clone();
			_context.Floors.Add(newFloor);
			await _context.SaveChangesAsync();
			return newFloor.Id;
		}

		public Task<int> Count(int floorNumber, string buildingName)
		{
			return _context.Floors
				.Where(n => n.FloorNumber == floorNumber
					&& n.BuildingName == buildingName)
				.AsNoTracking()
				.CountAsync();
		}

		public Task Delete(string buildingName, int floorNumber)
		{
			var floor = new Floor
			{
				BuildingName = buildingName,
				FloorNumber = floorNumber
			};
			_context.Floors.Remove(floor);
			return _context.SaveChangesAsync();
		}

		public Task<Floor> GetFloor(int floorNumber, string buildingName)
		{
			return _context.Floors
				.Where(n => n.FloorNumber == floorNumber && n.BuildingName == buildingName)
				.AsNoTracking()
				.FirstOrDefaultAsync();
		}

		public Task<FloorInfo[]> GetInfo()
		{
			return _context.Floors
				.Select(n => new FloorInfo { BuildingName = n.BuildingName, FloorNumber = n.FloorNumber!.Value })
				.AsNoTracking()
				.ToArrayAsync();
		}
	}
}
