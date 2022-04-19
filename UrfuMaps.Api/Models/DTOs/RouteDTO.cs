using System;
using System.Collections.Generic;

namespace UrfuMaps.Api.Models
{
	public class RouteDTO
	{
		public IEnumerable<EdgeDTO> Edges { get; set; } = new List<EdgeDTO>();
	}

	public class EdgeDTO
	{
		public Guid SourceId { get; set; }
		public Guid DestinationId { get; set; }
	}
}
