using Microsoft.EntityFrameworkCore;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<Floor> Floors => Set<Floor>();
		public DbSet<Position> Positions => Set<Position>();
		public DbSet<User> Users => Set<User>();
		public DbSet<Edge> Edges => Set<Edge>();
		public DbSet<PositionType> Types => Set<PositionType>();
		public DbSet<Prefix> Prefixes => Set<Prefix>();

		protected override void OnModelCreating(ModelBuilder model)
		{
			model.Entity<Floor>()
				.ToTable("Floors")
				.HasKey(x => x.Id);

			model.Entity<Position>()
				.ToTable("Positions")
				.HasKey(x => x.Id);

			model.Entity<Edge>()
				.ToTable("Edges")
				.HasKey(x => new { x.FromId, x.ToId });

			model.Entity<PositionType>()
				.ToTable("Types")
				.HasKey(x => x.Name);

			model.Entity<Prefix>()
				.ToTable("Prefixes")
				.HasKey(x => x.Value);

			model.Entity<Position>()
				.HasOne<Floor>()
				.WithMany()
				.IsRequired()
				.OnDelete(DeleteBehavior.Cascade);

			model.Entity<Position>()
				.HasOne<PositionType>()
				.WithMany()
				.HasForeignKey(x => x.Type)
				.OnDelete(DeleteBehavior.SetNull);

			model.Entity<Edge>()
			.HasOne(x => x.FromPosition)
			.WithMany()
			.HasForeignKey(x => x.FromId)
			.OnDelete(DeleteBehavior.Cascade);

			model.Entity<Edge>()
				.HasOne(x => x.ToPosition)
				.WithMany()
				.HasForeignKey(x => x.ToId)
				.OnDelete(DeleteBehavior.Cascade);
		}
	}
}
