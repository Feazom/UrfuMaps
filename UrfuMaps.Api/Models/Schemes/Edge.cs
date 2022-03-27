namespace UrfuMaps.Api.Models
{
	public class Edge
	{
		public int FromId { get; set; }
		public Position? PositionFrom { get; set; }

		public int ToId { get; set; }
		public Position? PositionTo { get; set; }
	}
}
