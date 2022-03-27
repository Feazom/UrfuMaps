using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class CreatePositionDTO
	{
		public int LocalId { get; set; }
		[StringLength(10)]
		public string? Name { get; set; }
		[StringLength(10)]
		public string? Type { get; set; }
		public string? Description { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }
		public IEnumerable<int> RelatedWith { get; set; } = new List<int>();
	}
}
