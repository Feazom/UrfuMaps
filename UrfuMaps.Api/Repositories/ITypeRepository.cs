using System.Collections.Generic;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public interface ITypeRepository
	{
		public Task AddIfNotExist(string type);
		public Task<List<string>> GetAll();
	}
}
