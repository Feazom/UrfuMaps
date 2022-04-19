using System.Collections.Generic;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Services
{
	public interface IRouteService
	{
		Task<IEnumerable<string>?> GetRoute(string source, string destination);
	}
}
