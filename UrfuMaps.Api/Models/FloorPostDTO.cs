using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class FloorPostDTO
	{
		[StringLength(10)]
		public string BuildingName { get; set; }
		public int Floor { get; set; }
		public IFormFile Image { get; set; }
		public PositionDTO[] Positions { get; set; }
	}
}
