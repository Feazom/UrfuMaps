using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class Position
	{
		public int Id { get; set; }
		//public int FloorId { get; set; }
		[StringLength(10)]
		public string? Type { get; set; }
		[StringLength(10)]
		public string? Name { get; set; }
		public string? Description { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }

		public virtual ICollection<Edge> RelatedTo { get; set; } = new List<Edge>();
		public virtual ICollection<Edge> RelatedFrom { get; set; } = new List<Edge>();
	}
}
