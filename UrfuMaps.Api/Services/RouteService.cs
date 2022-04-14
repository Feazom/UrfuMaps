using Dijkstra.NET.Graph;
using Dijkstra.NET.ShortestPath;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using Graphalo;
using Graphalo.Traversal;

namespace UrfuMaps.Api.Services
{
	class Point
	{
		public Guid Id { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }
	}

	class RelativePoints
	{
		public Point? FromPoint { get; set; }
		public Point? ToPoint { get; set; }
	}

	public class RouteService : IRouteService
	{
		private readonly AppDbContext _db;

		public RouteService(AppDbContext context)
		{
			_db = context;
		}

		public async Task<IEnumerable<string>?> GetRoute(string source, string destination)
		{
			//List<(Point sourcePosition, Point destinationPosition)> edges = new();

			var edges = await _db.Edges
				.Include(e => e.FromPosition)
				.Include(e => e.ToPosition)
				.Select(e => new RelativePoints
				{
					FromPoint = new Point
					{
						Id = e.FromPosition!.Id,
						X = e.FromPosition.X,
						Y = e.FromPosition.Y
					},
					ToPoint = new Point
					{
						Id = e.ToPosition!.Id,
						X = e.ToPosition.X,
						Y = e.ToPosition.Y
					}
				})
				.AsNoTracking()
				.ToArrayAsync();

			//foreach (var edge in edgesScheme)
			//{
			//	//if (edge.FromPosition != null && edge.ToPosition != null)
			//	//{
			//		edges.Add((new PositionDTO
			//		{
			//			Id = edge.FromPosition.Id,
			//			X = edge.FromPosition.X,
			//			Y = edge.FromPosition.Y

			//		}, new PositionDTO
			//		{
			//			Id = edge.ToPosition.Id,
			//			X = edge.ToPosition.X,
			//			Y = edge.ToPosition.Y

			//		}));
			//	//}
			//}

			var graph = new DirectedGraph<string>();

			foreach (var edge in edges)
			{
				graph.AddEdge(new Edge<string>(
					edge.FromPoint!.Id.ToString(),
					edge.ToPoint!.Id.ToString(),
					GetLength(edge.FromPoint, edge.ToPoint))
				);
			}

			var traversalResult = graph.Traverse(TraversalKind.Dijkstra, source, destination);

			if (!traversalResult.Success)
			{
				return null;
			}

			return traversalResult.Results;
		}

		private static int GetLength(Point source, Point destination)
		{
			if (source.X.HasValue && source.Y.HasValue &&
				destination.X.HasValue && destination.Y.HasValue)
			{

				var x1 = source.X.Value;
				var x2 = destination.X.Value;
				var y1 = source.Y.Value;
				var y2 = destination.Y.Value;

				return (int)Math.Round(Math.Sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) * 10000);
			}
			else
			{
				throw new ArgumentNullException("one of the coordinates was null");
			}
		}
	}
}
