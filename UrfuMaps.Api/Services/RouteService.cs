using Graphalo;
using Graphalo.Traversal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Services
{
	public class RouteService : IRouteService
	{
		private readonly IEdgeRepository _edges;

		public RouteService(IEdgeRepository edges)
		{
			_edges = edges;
		}

		public async Task<IEnumerable<string>?> GetRoute(string source, string destination)
		{
			var edges = await _edges.GetAll();

			var graph = new DirectedGraph<string>();

			foreach (var edge in edges)
			{
				graph.AddEdge(new Edge<string>(
					edge.FromNode.Id.ToString(),
					edge.ToNode.Id.ToString(),
					GetLength(edge.FromNode, edge.ToNode))
				);
			}

			var traversalResult = graph.Traverse(TraversalKind.Dijkstra, source, destination);

			if (!traversalResult.Success)
			{
				return null;
			}

			return traversalResult.Results;
		}

		private static int GetLength(PositionNode source, PositionNode destination)
		{
			var x1 = source.X;
			var x2 = destination.X;
			var y1 = source.Y;
			var y2 = destination.Y;

			return (int)Math.Round(Math.Sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) * 10000);
		}
	}
}
