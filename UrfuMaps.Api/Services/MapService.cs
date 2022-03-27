using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Services
{
	public class MapService : IMapService
	{
		private readonly AppDbContext _db;

		public MapService(AppDbContext context)
		{
			_db = context;
		}

		public async Task Create(CreateFloorDTO floorRequest)
		{
			var floorCount = await _db.Floors
				.Where(n => n.FloorNumber == floorRequest.FloorNumber &&
					n.BuildingName == floorRequest.BuildingName)
				.AsNoTracking()
				.CountAsync();

			foreach (var type in floorRequest.Positions.Select(n => n.Type))
			{
				var positionType = new PositionType { Name = type };
				if (!await _db.Types.ContainsAsync(positionType))
				{
					_db.Types.Add(positionType);
					await _db.SaveChangesAsync();
				}
			}

			if (floorRequest.Positions.Any() && floorCount == 0)
			{
				var positions = new Dictionary<int, Position>();
				foreach (var position in floorRequest.Positions)
				{
					positions.Add(position.LocalId, new Position
					{
						Type = position.Type,
						Name = position.Name,
						Description = position.Description,
						X = position.X,
						Y = position.Y
					});
				}

				var edges = new List<Edge>();
				foreach (var position in floorRequest.Positions)
				{
					positions[position.LocalId].RelatedTo = position.RelatedWith
						.Select(n => new Edge
						{
							PositionTo = positions[n],
							PositionFrom = positions[position.LocalId]
						})
						.ToList();
				}

				_db.Floors.Add(new Floor
				{
					BuildingName = floorRequest.BuildingName,
					FloorNumber = floorRequest.FloorNumber,
					ImageLink = floorRequest.ImageLink,
					Positions = positions.Values
				});

				await _db.SaveChangesAsync();
			}
		}

		public async Task Delete(int floor, string building)
		{
			var floorScheme = await _db.Floors
				.Where(n => n.FloorNumber == floor && n.BuildingName == building)
				.Include(n => n.Positions)
				.FirstOrDefaultAsync();

			_db.Floors.Remove(floorScheme);
			await _db.SaveChangesAsync();
		}

		public async Task<FloorDTO?> GetScheme(int floor, string building)
		{
			var floorScheme = await _db.Floors
				.Where(n => n.FloorNumber == floor && n.BuildingName == building)
				.Include(n => n.Positions)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (floorScheme == null || !floorScheme.Positions.Any())
			{
				return null;
			}

			return new FloorDTO
			{
				Id = floorScheme.Id,
				BuildingName = floorScheme.BuildingName,
				FloorNumber = floorScheme.FloorNumber,
				ImageLink = floorScheme.ImageLink,
				Positions = floorScheme.Positions
					.Select(n => new PositionDTO
					{
						Id = n.Id,
						Type = n.Type,
						Name = n.Name,
						Description = n.Description,
						X = n.X,
						Y = n.Y
					})
			};
		}
	}
}
