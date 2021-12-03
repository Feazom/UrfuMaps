using System.Collections.Generic;

namespace UrfuMaps.Api.Models
{
	public class FloorScheme
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public int Floor { get; set; }
		public string ImageLink { get; set; }
		public ICollection<Position> Positions { get; set; }
	}
}
