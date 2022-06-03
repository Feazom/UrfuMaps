using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;
using UrfuMaps.Api.Services;
using UrfuMaps.Api.Test.Repositories;

namespace UrfuMaps.Api.Test.Services
{
	public class MapServiceTest
	{
		private IMapService _mapService;
		private FloorRepositoryMock _floors;
		private TypeRepositoryMock _types;
		private PositionRepositoryMock _positions;
		private EdgeRepositoryMock _edges;

		[SetUp]
		public void Setup()
		{
			//var options = new DbContextOptionsBuilder<AppDbContext>()
			//	.UseInMemoryDatabase(databaseName: "base")
			//	.Options;
			//_db = new AppDbContext(options);

			_floors = new FloorRepositoryMock();
			_positions = new PositionRepositoryMock();
			_types = new TypeRepositoryMock();
			_edges = new EdgeRepositoryMock(_positions);

			_mapService = new FloorService(_floors, _types, _positions, _edges);
		}

		[TearDown]
		public void TearDown()
		{
			//_db.Database.EnsureDeleted();
			//_db.Dispose();
			_mapService = null;
		}

		[Test]
		public async Task AddNull()
		{
			CreateFloorDTO floorDTO = null;
			var result = await _mapService.Create(floorDTO);
			Assert.AreEqual(CreateResult.BadArgument, result);
		}

		[Test]
		public async Task AddFloorWithOnePos()
		{
			var floorId = 1;
			var positionId = 1;
			var floorDTO = new CreateFloorDTO
			{
				BuildingName = "building1",
				FloorNumber = 1,
				ImageLink = "very long string with link",
				Positions = new List<CreatePositionDTO>
				{
					new CreatePositionDTO()
					{
						LocalId = 1,
						Name = "cabinet1",
						Type = "cabinet",
						Description = "long desctription about this cabinet",
						X = 12.22,
						Y = 89.32
					}
				}
			};
			var expectedFloor = new Floor
			{
				Id = floorId,
				BuildingName = floorDTO.BuildingName,
				FloorNumber = floorDTO.FloorNumber,
				ImageLink = floorDTO.ImageLink
			};
			var expectedPosition = floorDTO.Positions
				.Select(p => p.ToSchemeWithoutId(floorId))
				.FirstOrDefault();
			expectedPosition.Id = positionId;

			var result = await _mapService.Create(floorDTO);
			var floor = _floors.Floors.FirstOrDefault();
			var position = _positions.Positions.FirstOrDefault();

			Assert.AreEqual(1, _floors.Floors.Count);
			Assert.AreEqual(1, _positions.Positions.Count);

			Assert.AreEqual(floorId, floor.Id);
			Assert.AreEqual(expectedFloor.BuildingName, floor.BuildingName);
			Assert.AreEqual(expectedFloor.FloorNumber, floor.FloorNumber);
			Assert.AreEqual(expectedFloor.ImageLink, floor.ImageLink);

			Assert.AreEqual(positionId, position.Id);
			Assert.AreEqual(floorId, position.FloorId);
			Assert.AreEqual(expectedPosition.Name, position.Name);
			Assert.AreEqual(expectedPosition.Type, position.Type);
			Assert.AreEqual(expectedPosition.Description, position.Description);
			Assert.AreEqual(expectedPosition.X, position.X);
			Assert.AreEqual(expectedPosition.Y, position.Y);

			Assert.AreEqual(CreateResult.Completed, result);
		}

		[Test]
		public async Task AddFloorWithEdge()
		{
			var floorId = 1;
			var floorDTO = new CreateFloorDTO
			{
				BuildingName = "building1",
				FloorNumber = 1,
				ImageLink = "very long string with link",
				Positions = new List<CreatePositionDTO>
				{
					new CreatePositionDTO()
					{
						LocalId = 1,
						Name = "cabinet1",
						Type = "cabinet",
						Description = "long desctription about this cabinet",
						X = 12.22,
						Y = 89.32
					},
					new CreatePositionDTO()
					{
						LocalId = 2,
						Name = "cabinet2",
						Type = "cabinet",
						Description = "long desctription about this cabinet",
						X = 65.27,
						Y = 34.62
					}
				},
				Edges = new List<EdgeDTO>
				{
					new EdgeDTO
					{
						DestinationId = 1,
						SourceId = 2
					},
					new EdgeDTO
					{
						DestinationId = 2,
						SourceId = 1
					}
				}
			};
			var expectedFloor = new Floor
			{
				Id = floorId,
				BuildingName = floorDTO.BuildingName,
				FloorNumber = floorDTO.FloorNumber,
				ImageLink = floorDTO.ImageLink
			};
			var expectedPositions = floorDTO.Positions
				.Select(p => p.ToSchemeWithoutId(floorId));
			var expectedEdges = floorDTO.Edges
				.Select(e => new Edge
				{
					FromId = e.SourceId,
					ToId = e.DestinationId
				});

			var result = await _mapService.Create(floorDTO);
			var floor = _floors.Floors.FirstOrDefault();
			var positions = _positions.Positions;
			var edges = _edges.Edges;

			Assert.AreEqual(1, _floors.Floors.Count);
			Assert.AreEqual(1, _positions.Positions.Count);
			Assert.AreEqual(1, _edges.Edges.Count);

			Assert.AreEqual(floorId, floor.Id);
			Assert.AreEqual(expectedFloor.BuildingName, floor.BuildingName);
			Assert.AreEqual(expectedFloor.FloorNumber, floor.FloorNumber);
			Assert.AreEqual(expectedFloor.ImageLink, floor.ImageLink);

			Assert.AreEqual(expectedPositions.Count(), positions.Count);

			Assert.AreEqual(expectedEdges.Count(), edges.Count);

			Assert.AreEqual(CreateResult.Completed, result);
		}

		[Test]
		public async Task AddFloorWithDuplicate()
		{
			var floorId = 1;
			var positionId = 1;
			var floorDTO = new CreateFloorDTO
			{
				BuildingName = "building1",
				FloorNumber = 1,
				ImageLink = "very long string with link",
				Positions = new List<CreatePositionDTO>
				{
					new CreatePositionDTO()
					{
						LocalId = 1,
						Name = "cabinet1",
						Type = "cabinet",
						Description = "long desctription about this cabinet",
						X = 12.22,
						Y = 89.32
					}
				}
			};
			var expectedFloor = new Floor
			{
				Id = floorId,
				BuildingName = floorDTO.BuildingName,
				FloorNumber = floorDTO.FloorNumber,
				ImageLink = floorDTO.ImageLink
			};
			var expectedPosition = floorDTO.Positions
				.Select(p => p.ToSchemeWithoutId(floorId))
				.FirstOrDefault();
			expectedPosition.Id = positionId;

			await _floors.Add(expectedFloor);
			await _positions.Add(expectedPosition);

			var result = await _mapService.Create(floorDTO);
			var floor = _floors.Floors.FirstOrDefault();
			var position = _positions.Positions.FirstOrDefault();

			Assert.AreEqual(1, _floors.Floors.Count);
			Assert.AreEqual(1, _positions.Positions.Count);

			Assert.AreEqual(CreateResult.Duplicate, result);
		}

		[Test]
		public async Task AddFloorWithNullType()
		{
			var floorId = 1;
			var positionId = 1;
			var floorDTO = new CreateFloorDTO
			{
				BuildingName = "building1",
				FloorNumber = 1,
				ImageLink = "very long string with link",
				Positions = new List<CreatePositionDTO>
				{
					new CreatePositionDTO()
					{
						LocalId = 1,
						Name = "cabinet1",
						Description = "long desctription about this cabinet",
						X = 12.22,
						Y = 89.32
					}
				}
			};
			var expectedFloor = new Floor
			{
				Id = floorId,
				BuildingName = floorDTO.BuildingName,
				FloorNumber = floorDTO.FloorNumber,
				ImageLink = floorDTO.ImageLink
			};
			var expectedPosition = floorDTO.Positions
				.Select(p => p.ToSchemeWithoutId(floorId))
				.FirstOrDefault();
			expectedPosition.Id = positionId;

			var result = await _mapService.Create(floorDTO);
			var floor = _floors.Floors.FirstOrDefault();
			var position = _positions.Positions.FirstOrDefault();

			Assert.AreEqual(0, _floors.Floors.Count);
			Assert.AreEqual(0, _positions.Positions.Count);

			Assert.AreEqual(CreateResult.BadArgument, result);
		}

		[Test]
		public async Task AddFloorWithNullCoords()
		{
			var floorId = 1;
			var positionId = 1;
			var floorDTO = new CreateFloorDTO
			{
				BuildingName = "building1",
				FloorNumber = 1,
				ImageLink = "very long string with link",
				Positions = new List<CreatePositionDTO>
				{
					new CreatePositionDTO()
					{
						LocalId = 1,
						Name = "cabinet1",
						Type = "cabinet",
						Description = "long desctription about this cabinet"
					}
				}
			};
			var expectedFloor = new Floor
			{
				Id = floorId,
				BuildingName = floorDTO.BuildingName,
				FloorNumber = floorDTO.FloorNumber,
				ImageLink = floorDTO.ImageLink
			};
			var expectedPosition = floorDTO.Positions
				.Select(p => p.ToSchemeWithoutId(floorId))
				.FirstOrDefault();
			expectedPosition.Id = positionId;

			var result = await _mapService.Create(floorDTO);
			var floor = _floors.Floors.FirstOrDefault();
			var position = _positions.Positions.FirstOrDefault();

			Assert.AreEqual(0, _floors.Floors.Count);
			Assert.AreEqual(0, _positions.Positions.Count);

			Assert.AreEqual(CreateResult.BadArgument, result);
		}

		[Test]
		public async Task AddEmptyPositions()
		{
			var floorDTO = new CreateFloorDTO
			{
				BuildingName = "testName",
				FloorNumber = 1,
				ImageLink = "very long string with link",
				Positions = new List<CreatePositionDTO>()
			};

			var result = await _mapService.Create(floorDTO);

			Assert.AreEqual(CreateResult.BadArgument, result);
		}

		[Test]
		public async Task GetNotNull()
		{
			var floorId = 1;
			var positionId = 2;
			var expectedFloor = new Floor
			{
				Id = floorId,
				BuildingName = "testName",
				FloorNumber = 1,
				ImageLink = "very long string with link"
			};
			var expectedPosition = new Position
			{
				Id = positionId,
				FloorId = floorId,
				Name = "testCabinet1",
				Type = "cabinet",
				Description = "long desctription about this cabinet",
				X = 12.22,
				Y = 89.32
			};
			_floors.Floors.Add(expectedFloor);
			_positions.Positions.Add(expectedPosition);

			var floor = await _mapService.GetScheme(
				expectedFloor.FloorNumber.Value, expectedFloor.BuildingName);
			var position = floor.Positions.FirstOrDefault();

			Assert.AreEqual(floorId, floor.Id);
			Assert.AreEqual(expectedFloor.BuildingName, floor.BuildingName);
			Assert.AreEqual(expectedFloor.FloorNumber, floor.FloorNumber);
			Assert.AreEqual(expectedFloor.ImageLink, floor.ImageLink);

			Assert.AreEqual(positionId, position.Id);
			Assert.AreEqual(expectedPosition.Name, position.Name);
			Assert.AreEqual(expectedPosition.Type, position.Type);
			Assert.AreEqual(expectedPosition.Description, position.Description);
			Assert.AreEqual(expectedPosition.X, position.X);
			Assert.AreEqual(expectedPosition.Y, position.Y);
		}

		[Test]
		public async Task GetNotExist()
		{
			var floorScheme = await _mapService.GetScheme(-100, "");

			Assert.Null(floorScheme);
		}

		//[Test]
		//public async Task GetEmptyPostitions()
		//{
		//	var expectedFloorScheme = new FloorScheme
		//	{
		//		BuildingName = "testName",
		//		FloorNumber = 1,
		//		ImageLink = "very long string with link",
		//		Positions = new List<PositionScheme>()
		//	};

		//	_db.Floors.Add(expectedFloorScheme);
		//	_db.SaveChanges();

		//	var mapService = new MapService(_db);
		//	var floorScheme = await mapService.GetScheme(-100, "");

		//	Assert.Null(floorScheme);
		//}
	}
}