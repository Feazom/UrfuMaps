using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class PositionType
	{
		[StringLength(10)]
		public string? Name { get; set; }
		public ICollection<Position> Positions { get; set; } = new List<Position>();
	}
}
