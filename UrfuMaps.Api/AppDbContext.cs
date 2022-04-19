using Microsoft.EntityFrameworkCore;
using System.Linq;
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

		protected override void OnModelCreating(ModelBuilder model)
		{
			model.Entity<Floor>()
				.ToTable("Floors")
				.HasKey(x => x.Id);

			model.Entity<Position>()
				.ToTable("Positions")
				.HasKey(x => x.Id);

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

			//model.Entity<Edge>()
			//	.HasOne<Position>()
			//	.WithMany()
			//	.HasForeignKey(x => x.FromId)
			//	.IsRequired()
			//	.OnDelete(DeleteBehavior.Cascade);

			//model.Entity<Edge>()
			//	.HasOne<Position>()
			//	.WithMany()
			//	.HasForeignKey(x => x.ToId)
			//	.IsRequired()
			//	.OnDelete(DeleteBehavior.Cascade);

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

			
			//model.Entity<Position>()
			//	.HasMany(x => x.FromPosition)
			//	.WithMany(x => x.ToPosition)
			//	.UsingEntity<Edge>(
			//		j => j
			//			.HasOne(e => e.FromPosition!)
			//			.WithMany(p => p.ToEdges)
			//			.HasForeignKey(e => e.FromPosition),
			//		j => j
			//			.HasOne(e => e.ToPosition!)
			//			.WithMany(p => p.FromEdges)
			//			.HasForeignKey(e => e.ToId),
			//		j => {
			//			j.HasKey(e => new { e.FromId, e.ToId });
			//		}
			//	);

			
		}

		public void DetachLocalEdge(Edge edge)
		{
			var local = Set<Edge>()
				.Local
				.FirstOrDefault(entry => entry.FromId == edge.FromId && 
					entry.ToId == edge.ToId);
			if (local != null)
			{
				Entry(local).State = EntityState.Detached;
			}
			Entry(edge).State = EntityState.Modified;
		}
	}
}
