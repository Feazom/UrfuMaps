using System;
using System.ComponentModel.DataAnnotations;

namespace UrfuMaps.Api.Models
{
	public class Prefix : ICloneable
	{
		[StringLength(5)]
		public string? Value { get; set; }

		public object Clone()
		{
			return new Prefix
			{
				Value = Value
			};
		}
	}
}