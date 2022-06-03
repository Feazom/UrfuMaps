namespace UrfuMaps.Api.Models
{
	public class GraphEdge
	{
		public GraphEdge(PositionNode fromNode, PositionNode toNode)
		{
			FromNode = fromNode;
			ToNode = toNode;
		}

		public PositionNode FromNode { get; set; }
		public PositionNode ToNode { get; set; }
	}

	public class PositionNode
	{
		public PositionNode(int id, double x, double y, string type)
		{
			Id = id;
			X = x;
			Y = y;
			Type = type;
		}

		public int Id { get; set; }
		public double X { get; set; }
		public double Y { get; set; }
		public string Type { get; set; }
	}
}
