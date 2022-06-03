using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Test.Repositories
{
	public class FloorRepositoryMock : IFloorRepository
	{
		public List<Floor> Floors { get; set; }
		private int _lastId;

		public FloorRepositoryMock()
		{
			Floors = new();
			_lastId = 0;
		}

		public Task<int> Add(Floor floor)
		{
			var result = new TaskCompletionSource<int>();
			if (!Floors.Select(f => f.Id).Contains(floor.Id))
			{
				var newFloor = (Floor)floor.Clone();
				var floorId = floor.Id ?? ++_lastId;
				newFloor.Id = floorId;
				Floors.Add(newFloor);
				result.SetResult(floorId);
			}
			else
			{
				result.SetException(new Exception("duplicate"));
			}
			return result.Task;
		}

		public Task<int> Count(int floorNumber, string buildingName)
		{
			var result = new TaskCompletionSource<int>();
			result.SetResult(Floors.Count);
			return result.Task;
		}

		public Task Delete(string buildingName, int floorNumber)
		{
			var result = new TaskCompletionSource();
			try
			{
				Floors.RemoveAll(f => f.BuildingName == buildingName && f.FloorNumber == floorNumber);
				result.SetResult();
			}
			catch (Exception e)
			{
				result.SetException(e);
			}
			return result.Task;
		}

		public Task<Floor> GetFloor(int floorNumber, string buildingName)
		{
			var result = new TaskCompletionSource<Floor>();
			try
			{
				var floor = Floors
					.Where(f => f.BuildingName == buildingName && f.FloorNumber == floorNumber)
					.FirstOrDefault();
				result.SetResult(floor);
			}
			catch (Exception e)
			{
				result.SetException(e);
			}
			return result.Task;
		}

		public Task<FloorInfo[]> GetInfo()
		{
			var result = new TaskCompletionSource<FloorInfo[]>();
			try
			{
				var info = Floors
					.Select(n => new FloorInfo { BuildingName = n.BuildingName, FloorNumber = n.FloorNumber!.Value })
					.ToArray();
				result.SetResult(info);
			}
			catch (Exception e)
			{
				result.SetException(e);
			}
			return result.Task;
		}
	}
}
