using System.Collections.Generic;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Services
{
	public interface IInfoService
	{
		Task<IEnumerable<InfoDTO>?> GetInfo();
	}
}
