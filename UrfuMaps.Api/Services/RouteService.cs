using Dijkstra.NET.Graph;
using Dijkstra.NET.ShortestPath;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Services
{
	public class RouteService : IRouteService
	{
		private readonly AppDbContext _db;

		public RouteService(AppDbContext context)
		{
			_db = context;
		}

		public async Task<RouteDTO?> GetRoute(uint source, uint destination)
		{
			List<(PositionDTO sourcePosition, PositionDTO destinationPosition)> edges = new();

			await _db.Edges
				.Where(n => n.PositionFrom != null && n.PositionTo != null &&
					n.PositionFrom.X != null && n.PositionFrom.Y != null &&
					n.PositionTo.X != null && n.PositionTo.Y != null)
				.ForEachAsync(n =>
				{
					edges.Add((new PositionDTO
					{
						Id = n.PositionFrom!.Id,
						X = n.PositionFrom.X,
						Y = n.PositionFrom.Y

					}, new PositionDTO
					{
						Id = n.PositionTo!.Id,
						X = n.PositionTo.X,
						Y = n.PositionTo.Y

					}));
				});

			var graph = new Graph<uint, bool>();

			foreach (var (sourcePosition, destinationPosition) in edges)
			{
				graph.AddNode((uint)sourcePosition.Id);
				graph.AddNode((uint)destinationPosition.Id);

				graph.Connect
				(
					(uint)sourcePosition.Id,
					(uint)destinationPosition.Id,
					GetLength(
						(double)sourcePosition.X!,
						(double)destinationPosition.X!,
						(double)sourcePosition.Y!,
						(double)destinationPosition.Y!),
					true
				);
			}

			var result = graph.Dijkstra(source, destination);

			if (result.IsFounded)
			{
				var previous = result.GetPath().First();
				var route = new RouteDTO();

				route.Edges = result.GetPath()
					.Skip(1)
					.Select(n => new EdgeDTO
					{
						SourceId = previous,
						DestinationId = n
					});

				return route;
			}
			return null;
		}

		private static int GetLength(double x1, double x2, double y1, double y2)
		{
			return (int)Math.Round(Math.Sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) * 10000);
		}
	}
}
