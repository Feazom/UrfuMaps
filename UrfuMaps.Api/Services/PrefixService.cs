using System.Collections.Generic;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Services
{
	public interface IPrefixService
	{
		Task<List<Prefix>> GetPrefixes();
	}

	public class PrefixService : IPrefixService
	{
		private readonly IPrefixRepository _prefixes;

		public PrefixService(IPrefixRepository prefixes)
		{
			_prefixes = prefixes;
		}

		public Task<List<Prefix>> GetPrefixes()
		{
			return _prefixes.GetAll();
		}
	}
}
