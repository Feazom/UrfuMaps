using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using UrfuMaps.Api;

namespace UrfuMapsApi.Test
{
	class UserServiceTest
	{
		public AppDbContext Db { get; set; }

		[OneTimeSetUp]
		public void GlobalSetup()
		{
		}

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

		//[Test]
		//public async Task Authenticate()
		//{
		//	var user = new User("test",
		//		BC.HashPassword(
		//			"password",
		//			BC.GenerateSalt(4),
		//			true,
		//			BCrypt.Net.HashType.SHA256));

		//	var 

		//	Assert.AreEqual(expectedFloorScheme.Positions[0].Y, floorScheme.Positions[0].Y);

		//}
	}
}
