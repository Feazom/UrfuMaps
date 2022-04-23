using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class CreateFloorDTO
	{
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public int? FloorNumber { get; set; }
		public string? ImageLink { get; set; }
		public IEnumerable<CreatePositionDTO> Positions { get; set; } = new List<CreatePositionDTO>();
		public IEnumerable<EdgeDTO> Edges { get; set; } = new List<EdgeDTO>();
	}
}
