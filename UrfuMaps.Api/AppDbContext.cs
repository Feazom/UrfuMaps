using Microsoft.EntityFrameworkCore;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<FloorScheme> Floors { get; set; }
		public DbSet<User> Users { get; set; }

		protected override void OnModelCreating(ModelBuilder model)
		{
			model.Entity<FloorScheme>()
				.ToTable("Floors")
				.HasKey(x => new { x.Floor, x.BuildingName });

			model.Entity<PositionScheme>()
				.ToTable("Positions")
				.HasKey(x => x.Cabinet);

			model.Entity<PositionScheme>()
				.HasOne<FloorScheme>()
				.WithMany(x => x.Positions)
				.HasForeignKey(x => new { x.Floor, x.BuildingName });
		}
	}
}
