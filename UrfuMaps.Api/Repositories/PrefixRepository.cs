using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UrfuMaps.Api.Repositories
{
	public interface IPrefixRepository
	{
		public Task<List<string>> GetAll();
	}

	public class PrefixRepository : Repository, IPrefixRepository
	{
		public PrefixRepository(AppDbContext context) : base(context) { }

		public Task<List<string>> GetAll()
		{
			return _context.Prefixes
				.Select(p => p.Value!)
				.AsNoTracking()
				.ToListAsync();
		}
	}
}
