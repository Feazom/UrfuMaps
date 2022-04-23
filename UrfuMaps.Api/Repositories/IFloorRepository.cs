using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public interface IFloorRepository
	{
		public Task<int> Count(int floorNumber, string buildingName);
		public Task<int?> Add(Floor floor);
		public Task<Floor> GetFloor(int floorNumber, string buildingName);
		public Task Delete(string buildingName, int floorNumber);
		public Task<FloorInfo[]> GetInfo();
	}
}
