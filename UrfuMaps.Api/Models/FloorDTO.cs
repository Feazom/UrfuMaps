using System.ComponentModel.DataAnnotations;
using System;
using System.Linq;
using System.Collections.Generic;

namespace UrfuMaps.Api.Models
{
	public class FloorDTO
	{
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public int? Floor { get; set; }
		public string? ImageLink { get; set; }
		public List<PositionDTO> Positions { get; set; } = new List<PositionDTO>();

		public FloorScheme ToScheme()
		{
			if (BuildingName == null || Floor == null ||
				ImageLink == null || Positions == null)
			{
				throw new NullReferenceException();
			}

			return new FloorScheme
			{
				BuildingName = BuildingName,
				Floor = Floor.Value,
				ImageLink = ImageLink,
				Positions = Positions
					.Select(n => n.ToScheme(BuildingName, Floor.Value))
					.Where(n => n != null)
					.ToList()
			};
		}
	}
}
