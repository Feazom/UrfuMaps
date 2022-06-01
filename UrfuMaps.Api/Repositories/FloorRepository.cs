using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public interface IFloorRepository
	{
		public Task<int> Count(int floorNumber, string buildingName);
		public Task<int> Add(Floor floor);
		public Task<Floor> GetFloor(int floorNumber, string buildingName);
		public ValueTask<Floor> GetFloor(int id);
		public Task Delete(string buildingName, int floorNumber);
		public Task<FloorInfo[]> GetInfo();
	}

	public class FloorRepository : Repository, IFloorRepository
	{
		public FloorRepository(AppDbContext context) : base(context) { }

		public async Task<int> Add(Floor floor)
		{
			var newFloor = (Floor)floor.Clone();
			_context.Floors.Add(newFloor);
			await _context.SaveChangesAsync();
			if (newFloor.Id.HasValue)
			{
				return newFloor.Id.Value;
			}
			else
			{
				throw new ArgumentNullException(nameof(newFloor.Id));
			}
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

		public ValueTask<Floor> GetFloor(int id)
		{
			return _context.Floors.FindAsync(id);
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
