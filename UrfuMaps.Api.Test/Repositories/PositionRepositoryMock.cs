using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Test.Repositories
{
	public class PositionRepositoryMock : IPositionRepository
	{
		public List<Position> Positions { get; set; }
		private int _lastId;

		public PositionRepositoryMock()
		{
			Positions = new();
			_lastId = 0;
		}

		public Task<int?> Add(Position position)
		{
			var result = new TaskCompletionSource<int?>();
			if (!Positions.Select(f => f.Id).Contains(position.Id))
			{
				var newPosition = (Position)position.Clone();
				var floorId = position.Id ?? ++_lastId;
				newPosition.Id = floorId;
				Positions.Add(newPosition);
				result.SetResult(floorId);
			}
			else
			{
				result.SetException(new Exception("duplicate"));
			}
			return result.Task;
		}

		public Task<List<Position>> GetPositions(int floorId)
		{
			var result = new TaskCompletionSource<List<Position>>();
			try
			{
				var positions = Positions
					.Where(p => p.FloorId == floorId)
					.ToList();
				result.SetResult(positions);
			}
			catch (Exception e)
			{
				result.SetException(e);
			}
			return result.Task;
		}

		public ValueTask<Position> GetPosition(int positionId)
		{
			var result = new TaskCompletionSource<Position>();
			try
			{
				var position = Positions
					.Where(p => p.Id == positionId)
					.FirstOrDefault();
				result.SetResult(position);
			}
			catch (Exception e)
			{
				result.SetException(e);
			}
			return new ValueTask<Position>(result.Task);
		}
	}
}
