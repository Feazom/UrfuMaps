using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UrfuMaps.Api.Core
{
	public class PositionsGraph
	{
		private AppDbContext _db;



		public PositionsGraph(AppDbContext dbContext)
		{
			_db = dbContext;
		}
	}
}
