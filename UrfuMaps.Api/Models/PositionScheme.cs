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
		public int? Floor { get; set; }
		public int? X { get; set; }
		public int? Y { get; set; }

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
