using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class Position
	{
		[Key]
		public string Cabinet { get; set; }
		public string Description { get; set; }
		public FloorScheme Floor { get; set; }
		public int FloorId { get; set; }
		public int X { get; set; }
		public int Y { get; set; }
	}
}
