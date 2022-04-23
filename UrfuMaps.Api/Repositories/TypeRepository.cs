﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public class TypeRepository : Repository, ITypeRepository
	{
		public TypeRepository(AppDbContext context) : base(context) { }

		public Task AddIfNotExist(string type)
		{
			return _context.Database.ExecuteSqlRawAsync("insert into \"Types\" (\"Name\") select {0} where not exists(select * from \"Types\" where \"Name\" = {0})", type);
		}

		public Task<List<string>> GetAll()
		{
			return _context.Types
				.Select(n => n.Name!)
				.AsNoTracking()
				.ToListAsync();
		}
	}
}
