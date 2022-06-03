using System.Collections.Generic;
using System.Threading.Tasks;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Services
{
	public interface ITypeService
	{
		Task<IEnumerable<string>> GetTypes();
	}

	public class TypeService : ITypeService
	{
		private readonly ITypeRepository _types;

		public TypeService(ITypeRepository types)
		{
			_types = types;
		}

		public async Task<IEnumerable<string>> GetTypes()
		{
			return await _types.GetAll();
		}
	}
}
