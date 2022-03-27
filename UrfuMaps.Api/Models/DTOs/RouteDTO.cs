using System.Collections.Generic;

namespace UrfuMaps.Api.Models
{
	public class RouteDTO
	{
		public IEnumerable<EdgeDTO> Edges { get; set; } = new List<EdgeDTO>();
	}

	public class EdgeDTO
	{
		public uint SourceId { get; set; }
		public uint DestinationId { get; set; }
	}
}
