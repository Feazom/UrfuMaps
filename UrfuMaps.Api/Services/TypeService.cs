using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UrfuMaps.Api.Services
{
	public class TypeService : ITypeService
	{
		private readonly AppDbContext _db;

		public TypeService(AppDbContext dbContext)
		{
			_db = dbContext;
		}

		public Task<string[]> GetTypes()
		{
			return _db.Types
				.Select(n => n.Name!)
				.AsNoTracking()
				.ToArrayAsync();
		}
	}
}
