namespace UrfuMaps.Api.Repositories
{
	public class Repository
	{
		protected readonly AppDbContext _context;

		public Repository(AppDbContext context)
		{
			_context = context;
		}
	}
}
