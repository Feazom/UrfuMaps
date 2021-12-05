using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace UrfuMaps.Api.Models
{
	public class FloorDTO
	{
		[StringLength(10)]
		public string BuildingName { get; set; }
		public int Floor { get; set; }
		public string ImageLink { get; set; }
		public PositionDTO[] Positions { get; set; }

		public FloorScheme ToScheme()
		{
			return new FloorScheme
			{
				BuildingName = BuildingName,
				Floor = Floor,
				ImageLink = ImageLink,
				Positions = Positions
					.Select(n => n.ToScheme(BuildingName, Floor))
					.Where(n => n != null)
					.ToArray()
			};
		}
	}
}
