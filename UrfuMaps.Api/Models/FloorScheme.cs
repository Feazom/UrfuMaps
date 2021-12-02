using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMapsApi.Models;

namespace UrfuMapsApi.Models
{
	public class FloorScheme
	{
		public int Floor { get; set; }
		public string ImageLink { get; set; }
		public Position[] Positions { get; set; }
	}
}
