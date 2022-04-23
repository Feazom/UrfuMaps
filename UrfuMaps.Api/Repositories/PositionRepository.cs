using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
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

		public Task<List<Position>> GetFloorPositions(int floorId)
		{
			return _context.Positions
				.Where(n => n.FloorId == floorId)
				.AsNoTracking()
				.ToListAsync();
		}
	}
}
