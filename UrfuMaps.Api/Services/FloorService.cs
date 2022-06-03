using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Services
{
	public interface IMapService
	{
		Task<CreateResult> Create(CreateFloorDTO floorScheme);
		Task<FloorDTO?> GetScheme(int floor, string building);
		Task Delete(int floor, string building);
	}

	public class FloorService : IMapService
	{
		private readonly IFloorRepository _floors;
		private readonly ITypeRepository _types;
		private readonly IPositionRepository _positions;
		private readonly IEdgeRepository _edges;

		public FloorService(IFloorRepository floor, ITypeRepository types, IPositionRepository positions, IEdgeRepository edges)
		{
			_floors = floor;
			_types = types;
			_positions = positions;
			_edges = edges;
		}

		public async Task<CreateResult> Create(CreateFloorDTO floorRequest)
		{
			if (floorRequest != null &&
				floorRequest.BuildingName != null &&
				floorRequest.FloorNumber != null &&
				floorRequest.ImageLink != null &&
				floorRequest.Positions != null &&
				floorRequest.Positions.Any() &&
				floorRequest.Positions.All(p =>
					p.Type != null && p.X.HasValue && p.Y.HasValue))
			{
				var floorCount = await _floors.Count(
					floorRequest.FloorNumber.Value,
					floorRequest.BuildingName);

				foreach (var type in floorRequest.Positions.Select(n => n.Type))
				{
					await _types.AddIfNotExist(type!);
				}

				if (floorCount == 0)
				{
					var floorId = await _floors.Add(new Floor
					{
						BuildingName = floorRequest.BuildingName,
						FloorNumber = floorRequest.FloorNumber.Value,
						ImageLink = floorRequest.ImageLink
					});

					var positions = new Dictionary<int, Position>();
					foreach (var position in floorRequest.Positions)
					{
						positions.Add(position.LocalId, position.ToSchemeWithoutId((int)floorId));
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

							edges.Add(firtsEdge);
							edges.Add(secondEdge);
						}
					}

					foreach (var edge in edges)
					{
						await _edges.Add(edge);
					}
					return CreateResult.Completed;
				}
				else
				{
					return CreateResult.Duplicate;
				}
			}
			else
			{
				return CreateResult.BadArgument;
			}
		}

		public Task Delete(int floor, string building)
		{
			return _floors.Delete(building, floor);
		}

		public async Task<FloorDTO?> GetScheme(int floorNumber, string buildingName)
		{
			var floor = await _floors.GetFloor(floorNumber, buildingName);
			if (floor is null || floor.Id is null)
			{
				return null;
			}
			var positions = await _positions.GetPositions(floor.Id.Value);

			if (!positions.Any())
			{
				return null;
			}

			return floor.ToDTO(positions.Select(n => n.ToDTO()));
		}
	}
}
