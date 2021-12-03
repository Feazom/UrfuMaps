using Microsoft.EntityFrameworkCore;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<FloorScheme> Buildings { get; set; }
		public DbSet<User> Users { get; set; }

		protected override void OnModelCreating(ModelBuilder model)
		{
			model.Entity<Position>()
				.HasOne(x => x.Floor)
				.WithMany(x => x.Positions)
				.HasForeignKey(x => x.FloorId);
		}
	}
}
