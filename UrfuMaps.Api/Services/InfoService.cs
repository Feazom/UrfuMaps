using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Services
{
	public class InfoService: IInfoService
	{
		private readonly AppDbContext _db;

		public InfoService(AppDbContext dbContext)
		{
			_db = dbContext;
		}

		public async Task<IEnumerable<InfoDTO>?> GetInfo()
		{
			var floors = await _db.Floors
				.Select(n => new FloorInfo { BuildingName = n.BuildingName, FloorNumber = n.FloorNumber!.Value })
				.AsNoTracking()
				.ToArrayAsync();

			var result = floors.GroupBy(n => n.BuildingName)
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
