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
	public interface IRouteService
	{
		Task<IEnumerable<int>?> GetRoute(int source, int destination);
		public Task<IEnumerable<RouteSegment>> GetSegments(int[] ids);
	}

	public class RouteService : IRouteService
	{
		private readonly IEdgeRepository _edges;
		private readonly IPositionRepository _positions;
		private readonly IFloorRepository _floors;

		public RouteService(IEdgeRepository edges, IPositionRepository positions, IFloorRepository floors)
		{
			_edges = edges;
			_positions = positions;
			_floors = floors;
		}

		public async Task<IEnumerable<RouteSegment>> GetSegments(int[] ids)
		{
			if (ids.Length == 0)
			{
				throw new ArgumentException("ids is empty", nameof(ids));
			}
			var segments = new List<RouteSegment>();
			var positions = await _positions.GetDictionaryByIds(ids);

			var floor = await _floors.GetFloor(positions[ids[0]].FloorId!.Value);
			if (floor is null)
			{
				throw new Exception("floor is mising");
			}
			var segment = new RouteSegment(
				floor.BuildingName!,
				floor.FloorNumber!.Value,
				new List<int> { ids[0] });

			for (int i = 1; i < ids.Length; i++)
			{
				if (positions[ids[i]].FloorId!.Value == floor.Id!.Value)
				{
					segment.Ids.Add(ids[i]);
				}
				else
				{
					floor = await _floors.GetFloor(positions[ids[i]].FloorId!.Value);
					if (floor is null)
					{
						throw new Exception("floor is mising");
					}
					segments.Add(segment);
					segment = new RouteSegment(
						floor.BuildingName!,
						floor.FloorNumber!.Value,
						new List<int> { ids[i] });
				}
			}
			segments.Add(segment);

			return segments;
		}

		public async Task<IEnumerable<int>?> GetRoute(int source, int destination)
		{
			var edges = await _edges.GetAll();

			var graph = new DirectedGraph<int>();

			foreach (var edge in edges)
			{
				graph.AddEdge((edge.FromNode.Type, edge.ToNode.Type) switch
				{
					("stair", "stair") =>
						new Edge<int>(edge.FromNode.Id, edge.ToNode.Id, 0.01),

					("entry", "entry") =>
						new Edge<int>(edge.FromNode.Id, edge.ToNode.Id, 150),

					(_, _) =>
						new Edge<int>(
							edge.FromNode.Id,
							edge.ToNode.Id,
							GetLength(edge.FromNode, edge.ToNode))
				});
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
