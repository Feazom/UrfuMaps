using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Services
{
	public interface IMapService
	{
		Task Create(CreateFloorDTO floorScheme);
		Task<FloorDTO?> GetScheme(int floor, string building);
		Task Delete(int floor, string building);
	}
}
