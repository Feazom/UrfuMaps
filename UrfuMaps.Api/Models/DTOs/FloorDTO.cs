using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class FloorDTO
	{
		public int Id { get; set; }
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public int? FloorNumber { get; set; }
		public string? ImageLink { get; set; }
		public IEnumerable<PositionDTO> Positions { get; set; } = new List<PositionDTO>();
	}
}
