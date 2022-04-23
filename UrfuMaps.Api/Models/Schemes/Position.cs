using System;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class Position: ICloneable
	{
		public int? Id { get; set; }
		public int? FloorId { get; set; }
		[StringLength(10)]
		public string? Type { get; set; }
		[StringLength(10)]
		public string? Name { get; set; }
		public string? Description { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }

		public object Clone()
		{
			return new Position
			{
				Id = Id,
				FloorId = FloorId,
				Type = Type,
				X = X,
				Y = Y,
				Name = Name,
				Description = Description
			};
		}

		public PositionDTO ToDTO()
		{
			return new PositionDTO
			{
				Id = Id,
				Type = Type,
				X = X,
				Y = Y,
				Name = Name,
				Description = Description
			};
		}
	}
}
