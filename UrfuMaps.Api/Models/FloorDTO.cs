using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace UrfuMaps.Api.Models
{
	public class FloorDTO
	{
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public int? FloorNumber { get; set; }
		public string? ImageLink { get; set; }
		public List<PositionDTO> Positions { get; set; } = new List<PositionDTO>();

		public FloorScheme ToScheme()
		{
			if (BuildingName == null || FloorNumber == null ||
				ImageLink == null || Positions == null)
			{
				throw new NullReferenceException();
			}

			return new FloorScheme
			{
				BuildingName = BuildingName,
				FloorNumber = FloorNumber.Value,
				ImageLink = ImageLink,
				Positions = Positions
					.Select(n => n.ToScheme(BuildingName, FloorNumber.Value))
					.Where(n => n != null)
					.ToList()
			};
		}
	}
}
