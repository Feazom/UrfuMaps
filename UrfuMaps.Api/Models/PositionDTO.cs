using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class PositionDTO
	{
		[StringLength(10)]
		public string? Cabinet { get; set; }
		public string? Description { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }

		public PositionScheme ToScheme(string building, int floor)
		{
			return new PositionScheme
			{
				Cabinet = Cabinet,
				Description = Description,
				BuildingName = building,
				FloorNumber = floor,
				X = X,
				Y = Y
			};
		}
	}
}
