using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class Floor : ICloneable
	{
		public int? Id { get; set; }
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public int? FloorNumber { get; set; }
		public string? ImageLink { get; set; }

		public object Clone()
		{
			return new Floor
			{
				Id = Id,
				BuildingName = BuildingName,
				FloorNumber = FloorNumber,
				ImageLink = ImageLink
			};
		}

		public FloorDTO ToDTO(IEnumerable<PositionDTO> positions)
		{
			return new FloorDTO
			{
				Id = Id,
				BuildingName = BuildingName,
				FloorNumber = FloorNumber,
				ImageLink = ImageLink,
				Positions = positions
			};
		}
	}
}
