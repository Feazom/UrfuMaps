using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public interface IPositionRepository
	{
		public Task<int?> Add(Position position);
		public Task<List<Position>> GetPositions(int floorId);
		public ValueTask<Position> GetPosition(int positionId);
		public Task<Position> GetPosition(string name);
		public Task<Dictionary<int?, Position>> GetDictionaryByIds(int[] ids);
	}

	public class PositionRepository : Repository, IPositionRepository
	{
		public PositionRepository(AppDbContext context) : base(context) { }

		public async Task<int?> Add(Position position)
		{
			var newPosition = (Position)position.Clone();
			_context.Positions.Add(newPosition);
			await _context.SaveChangesAsync();
			return newPosition.Id;
		}

		public Task<List<Position>> GetPositions(int floorId)
		{
			return _context.Positions
				.Where(n => n.FloorId == floorId)
				.AsNoTracking()
				.ToListAsync();
		}

		public ValueTask<Position> GetPosition(int positionId)
		{
			return _context.Positions
				.FindAsync(positionId);
		}

		public Task<Position> GetPosition(string name)
		{
			return _context.Positions
				.Where(n => n.Name == name)
				.AsNoTracking()
				.FirstOrDefaultAsync();
		}

		public Task<Dictionary<int?, Position>> GetDictionaryByIds(int[] ids)
		{
			return _context.Positions
				.Where(p => ids.Contains(p.Id!.Value))
				.ToDictionaryAsync(p => p.Id);
		}
	}
}
