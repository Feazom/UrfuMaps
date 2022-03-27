using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class InfoDTO
	{
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public IEnumerable<int> FloorList { get; set; } = new List<int>();
	}

	public class FloorInfo
	{
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public int FloorNumber { get; set; }
	}
}
