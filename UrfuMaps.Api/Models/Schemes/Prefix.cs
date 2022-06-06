using System;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class Prefix : ICloneable
	{
		[StringLength(5)]
		public string? Value { get; set; }
		[StringLength(10)]
		public string? Building { get; set; }

		public object Clone()
		{
			return new Prefix
			{
				Value = Value,
				Building = Building
			};
		}
	}
}