using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Services;

namespace UrfuMapsApi.Test
{
	public class Tests
	{
		public AppDbContext Db { get; set; }

		[SetUp]
		public void Setup()
		{
			var options = new DbContextOptionsBuilder<AppDbContext>()
				.UseInMemoryDatabase(databaseName: "base")
				.Options;

			Db = new AppDbContext(options);
		}

		[TearDown]
		public void TearDown()
		{
			Db.Database.EnsureDeleted();
			Db.Dispose();
		}

		[Test]
		public async Task AddNotNull()
		{
			var floorDTO = new FloorDTO
			{
				BuildingName = "testName",
				FloorNumber = 1,
				ImageLink = "very long string with link",
				Positions = new List<PositionDTO>
				{
					new PositionDTO()
					{
						Cabinet = "testCabinet1",
						Description = "long desctription about this cabinet",
						X = 12.22,
						Y = 89.32
					}
				}
			};
			var expectedFloorScheme = new FloorScheme
			{
				BuildingName = floorDTO.BuildingName,
				FloorNumber = floorDTO.FloorNumber,
				ImageLink = floorDTO.ImageLink,
				Positions = new List<PositionScheme>
				{
					new PositionScheme
					{
						Cabinet = floorDTO.Positions[0].Cabinet,
						Description = floorDTO.Positions[0].Description,
						BuildingName = floorDTO.BuildingName,
						FloorNumber = floorDTO.FloorNumber,
						X = floorDTO.Positions[0].X,
						Y = floorDTO.Positions[0].Y
					}
				}
			};

			var mapService = new MapService(Db);

			await mapService.Add(floorDTO);
			var floorScheme = Db.Floors.FirstOrDefault();

			Assert.AreEqual(expectedFloorScheme.BuildingName, floorScheme.BuildingName);
			Assert.AreEqual(expectedFloorScheme.FloorNumber, floorScheme.FloorNumber);
			Assert.AreEqual(expectedFloorScheme.ImageLink, floorScheme.ImageLink);
			Assert.AreEqual(expectedFloorScheme.Positions[0].Cabinet, floorScheme.Positions[0].Cabinet);
			Assert.AreEqual(expectedFloorScheme.Positions[0].Description, floorScheme.Positions[0].Description);
			Assert.AreEqual(expectedFloorScheme.BuildingName, floorScheme.Positions[0].BuildingName);
			Assert.AreEqual(expectedFloorScheme.FloorNumber, floorScheme.Positions[0].FloorNumber);
			Assert.AreEqual(expectedFloorScheme.Positions[0].X, floorScheme.Positions[0].X);
			Assert.AreEqual(expectedFloorScheme.Positions[0].Y, floorScheme.Positions[0].Y);

		}

		[Test]
		public void AddNull()
		{
			FloorDTO floorDTO = null;
			var mapService = new MapService(Db);

			Assert.ThrowsAsync<NullReferenceException>(async () => await mapService.Add(floorDTO));
		}

		[Test]
		public async Task AddEmptyPositions()
		{
			var floorDTO = new FloorDTO
			{
				BuildingName = "testName",
				FloorNumber = 1,
				ImageLink = "very long string with link",
				Positions = new List<PositionDTO>()
			};

			var mapService = new MapService(Db);

			await mapService.Add(floorDTO);

			Assert.AreEqual(0, Db.Floors.Count());
		}

		[Test]
		public async Task GetNotNull()
		{
			var expectedFloorScheme = new FloorScheme
			{
				BuildingName = "testName",
				FloorNumber = 1,
				ImageLink = "very long string with link",
				Positions = new List<PositionScheme>
					{
						new PositionScheme()
						{
							BuildingName = "testName",
							FloorNumber = 1,
							Cabinet = "testCabinet1",
							Description = "long desctription about this cabinet",
							X = 12.22,
							Y = 89.32
						}
					}
			};
			Db.Floors.Add(expectedFloorScheme);
			Db.SaveChanges();

			var mapService = new MapService(Db);

			var floorScheme = await mapService.GetScheme(
				expectedFloorScheme.FloorNumber.Value, expectedFloorScheme.BuildingName);

			Assert.AreEqual(expectedFloorScheme.BuildingName, floorScheme.BuildingName);
			Assert.AreEqual(expectedFloorScheme.FloorNumber, floorScheme.FloorNumber);
			Assert.AreEqual(expectedFloorScheme.ImageLink, floorScheme.ImageLink);
			Assert.AreEqual(expectedFloorScheme.Positions[0].Cabinet, floorScheme.Positions[0].Cabinet);
			Assert.AreEqual(expectedFloorScheme.Positions[0].Description, floorScheme.Positions[0].Description);
			Assert.AreEqual(expectedFloorScheme.Positions[0].X, floorScheme.Positions[0].X);
			Assert.AreEqual(expectedFloorScheme.Positions[0].Y, floorScheme.Positions[0].Y);
		}

		[Test]
		public async Task GetNotExist()
		{
			var mapService = new MapService(Db);
			var floorScheme = await mapService.GetScheme(-100, "");

			Assert.Null(floorScheme);
		}

		[Test]
		public async Task GetEmptyPostitions()
		{
			var expectedFloorScheme = new FloorScheme
			{
				BuildingName = "testName",
				FloorNumber = 1,
				ImageLink = "very long string with link",
				Positions = new List<PositionScheme>()
			};

			Db.Floors.Add(expectedFloorScheme);
			Db.SaveChanges();

			var mapService = new MapService(Db);
			var floorScheme = await mapService.GetScheme(-100, "");

			Assert.Null(floorScheme);
		}
	}
}