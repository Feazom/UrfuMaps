using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class PositionScheme
	{
		[StringLength(10)]
		public string? Cabinet { get; set; }
		public string? Description { get; set; }
		[StringLength(10)]
		public string? BuildingName { get; set; }
		public int? FloorNumber { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }

		public PositionDTO ToDTO()
		{
			return new PositionDTO
			{
				Cabinet = Cabinet,
				Description = Description,
				X = X,
				Y = Y
			};
		}
	}
}
