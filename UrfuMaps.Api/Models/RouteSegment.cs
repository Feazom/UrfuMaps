using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UrfuMaps.Api.Models
{
	public class RouteSegment
	{
		public RouteSegment(string building, int floor, List<int> ids)
		{
			Building = building;
			Floor = floor;
			Ids = ids;
		}

		public string Building { get; set; }
		public int Floor { get; set; }
		public List<int> Ids { get; set; }
	}
}
