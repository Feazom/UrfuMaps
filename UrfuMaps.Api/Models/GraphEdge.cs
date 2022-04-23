using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
		public PositionNode(int id, double x, double y)
		{
			Id = id;
			X = x;
			Y = y;
		}

		public int Id { get; set; }
		public double X { get; set; }
		public double Y { get; set; }
	}
}
