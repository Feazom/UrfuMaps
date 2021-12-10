using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace UrfuMaps.Api.Models
{
	public class FloorScheme
	{
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public int? Floor { get; set; }
		public string? ImageLink { get; set; }
		public List<PositionScheme> Positions { get; set; } = new List<PositionScheme>();

		public FloorDTO ToDTO()
		{
			return new FloorDTO
			{
				BuildingName = BuildingName,
				Floor = Floor,
				ImageLink = ImageLink,
				Positions = Positions
					.Select(n => n.ToDTO())
					.Where(n => n != null)
					.ToList()
					
			};
		}
	}
}
