using Microsoft.EntityFrameworkCore;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<Floor> Floors => Set<Floor>();
		public DbSet<User> Users => Set<User>();
		public DbSet<Edge> Edges => Set<Edge>();
		public DbSet<PositionType> Types => Set<PositionType>();

		protected override void OnModelCreating(ModelBuilder model)
		{
			//model.Entity<Floor>()
			//	.ToTable("Floors")
			//	.HasKey(x => x.Id);

			//model.Entity<Position>()
			//	.ToTable("Positions")
			//	.HasKey(x => x.Id);

			model.Entity<Position>()
				.HasIndex(x => new { x.Name, x.X, x.Y })
				.IsUnique();

			model.Entity<Edge>()
				.ToTable("Edges")
				.HasKey(x => new { x.FromId, x.ToId });

			model.Entity<PositionType>()
				.ToTable("Types")
				.HasKey(x => x.Name);

			model.Entity<Position>()
				.HasOne<Floor>()
				.WithMany(x => x.Positions)
				.IsRequired()
				.OnDelete(DeleteBehavior.Cascade);

			model.Entity<Position>()
				.HasOne<PositionType>()
				.WithMany(x => x.Positions)
				.HasForeignKey(x => x.Type)
				.OnDelete(DeleteBehavior.SetNull);

			model.Entity<Edge>()
				.HasOne(x => x.PositionFrom)
				.WithMany(x => x.RelatedTo)
				.HasForeignKey(x => x.FromId)
				.OnDelete(DeleteBehavior.Cascade);

			model.Entity<Edge>()
				.HasOne(x => x.PositionTo)
				.WithMany(x => x.RelatedFrom)
				.HasForeignKey(x => x.ToId)
				.OnDelete(DeleteBehavior.Cascade);
		}
	}
}
