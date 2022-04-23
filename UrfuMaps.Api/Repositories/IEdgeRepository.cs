using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public interface IEdgeRepository
	{
		public Task Add(Edge edge);
		public Task<List<GraphEdge>> GetAll();
	}
}
