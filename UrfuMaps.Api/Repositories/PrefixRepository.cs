using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public interface IPrefixRepository
	{
		public Task<List<Prefix>> GetAll();
	}

	public class PrefixRepository : Repository, IPrefixRepository
	{
		public PrefixRepository(AppDbContext context) : base(context) { }

		public Task<List<Prefix>> GetAll()
		{
			return _context.Prefixes
				.AsNoTracking()
				.ToListAsync();
		}
	}
}
