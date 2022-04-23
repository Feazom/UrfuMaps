using System.Collections.Generic;
using System.Threading.Tasks;

namespace UrfuMaps.Api.Services
{
	public interface ITypeService
	{
		Task<IEnumerable<string>> GetTypes();
	}
}
