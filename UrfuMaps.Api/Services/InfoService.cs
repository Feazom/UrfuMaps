using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Services
{
	public class InfoService : IInfoService
	{
		private readonly IFloorRepository _floors;

		public InfoService(IFloorRepository floors)
		{
			_floors = floors;
		}

		public async Task<IEnumerable<InfoDTO>?> GetInfo()
		{
			var floorsInfo = await _floors.GetInfo();

			var result = floorsInfo.GroupBy(n => n.BuildingName)
				.Select(n => new InfoDTO
				{
					BuildingName = n.Key,
					FloorList = n.Select(x => x.FloorNumber)
				});

			if (result != null)
			{
				return result;
			}
			return null;
		}
	}
}
