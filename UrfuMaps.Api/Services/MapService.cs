using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Services
{
	public class MapService : IMapService
	{
		private readonly IFloorRepository _floors;
		private readonly ITypeRepository _types;
		private readonly IPositionRepository _positions;
		private readonly IEdgeRepository _edges;

		public MapService(IFloorRepository floor, ITypeRepository types, IPositionRepository positions, IEdgeRepository edges)
		{
			_floors = floor;
			_types = types;
			_positions = positions;
			_edges = edges;
		}

		public async Task Create(CreateFloorDTO floorRequest)
		{
			if (floorRequest.BuildingName != null &&
				floorRequest.FloorNumber != null &&
				floorRequest.ImageLink != null)
			{
				var floorCount = await _floors.Count(
					floorRequest.FloorNumber.Value,
					floorRequest.BuildingName);

				foreach (var type in floorRequest.Positions.Select(n => n.Type))
				{
					if (type == null)
					{
						continue;
					}
					await _types.AddIfNotExist(type);
				}

				if (floorRequest.Positions.Any() && floorCount == 0)
				{
					var floorId = await _floors.Add(new Floor
					{
						BuildingName = floorRequest.BuildingName,
						FloorNumber = floorRequest.FloorNumber.Value,
						ImageLink = floorRequest.ImageLink
					});

					if (floorId == null)
					{
						throw new Exception("FloorId was null");
					}

					var positions = new Dictionary<int, Position>();
					foreach (var position in floorRequest.Positions)
					{
						if (position.X != null &&
							position.Y != null &&
							position.Type != null &&
							position.Name != null &&
							position.Description != null)
						{
							positions.Add(position.LocalId, position.ToSchemeWithoutId((int)floorId));
						}
					}

					foreach (var key in positions.Keys)
					{
						positions[key].Id = await _positions.Add(positions[key]);
					}

					var edges = new HashSet<Edge>();
					foreach (var edge in floorRequest.Edges)
					{
						if (positions[edge.SourceId].Id.HasValue &&
							positions[edge.DestinationId].Id.HasValue)
						{
							var firtsEdge = new Edge
							{
								FromId = positions[edge.DestinationId].Id!.Value,
								ToId = positions[edge.SourceId].Id!.Value
							};

							var secondEdge = firtsEdge.Reverse();

							//var firstEdges = edge.RelatedWith
							//	.Where(n => positions[n].Id.HasValue)
							//	.Select(n => new Edge
							//	{
							//		FromId = positions[edge.LocalId].Id!.Value,
							//		ToId = positions[n].Id!.Value
							//	})
							//	.ToList();

							//var secondEdges = edge.RelatedWith
							//	.Where(n => positions[n].Id.HasValue)
							//	.Select(n => new Edge
							//	{
							//		FromId = positions[n].Id!.Value,
							//		ToId = positions[edge.LocalId].Id!.Value
							//	})
							//	.ToList();

							edges.Add(firtsEdge);
							edges.Add(secondEdge);
						}
					}

					foreach (var edge in edges)
					{
						await _edges.Add(edge);
					}
				}
			}
			else
			{
				throw new ArgumentNullException(nameof(floorRequest));
			}
		}

		public Task Delete(int floor, string building)
		{
			return _floors.Delete(building, floor);
		}

		public async Task<FloorDTO?> GetScheme(int floorNumber, string buildingName)
		{
			var floor = await _floors.GetFloor(floorNumber, buildingName);
			if (floor == null || floor.Id == null)
			{
				return null;
			}
			var positions = await _positions.GetFloorPositions(floor.Id.Value);

			if (!positions.Any())
			{
				return null;
			}

			return floor.ToDTO(positions.Select(n => n.ToDTO()));
		}
	}
}
