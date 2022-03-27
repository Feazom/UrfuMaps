using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class Floor
	{
		public int Id { get; set; }
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public int? FloorNumber { get; set; }
		public string? ImageLink { get; set; }
		public ICollection<Position> Positions { get; set; } = new List<Position>();
	}
}
