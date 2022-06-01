using System;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class PositionType : ICloneable
	{
		[StringLength(10)]
		public string? Name { get; set; }

		public object Clone()
		{
			return new PositionType
			{
				Name = Name
			};
		}
	}
}
