using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public interface IPositionRepository
	{
		public Task<int?> Add(Position position);
		public Task<List<Position>> GetFloorPositions(int floorId);
	}
}
