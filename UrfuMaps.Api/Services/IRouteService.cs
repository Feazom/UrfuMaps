using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Services
{
	public interface IRouteService
	{
		Task<RouteDTO?> GetRoute(uint source, uint destination);
	}
}
