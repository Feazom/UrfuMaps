using System.Collections.Generic;
using System.Threading.Tasks;

namespace UrfuMaps.Api.Services
{
	public interface IRouteService
	{
		Task<IEnumerable<string>?> GetRoute(string source, string destination);
	}
}
