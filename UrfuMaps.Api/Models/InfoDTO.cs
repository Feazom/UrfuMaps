using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace UrfuMaps.Api.Models
{
	public class InfoDTO
	{
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public List<int?> FloorList { get; set; } = new();
	}

	public class FloorInfo
	{
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public int? FloorNumber { get; set; }
	}
}
