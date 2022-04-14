using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UrfuMaps.Api.Services
{
	public interface ITypeService
	{
		Task<string[]> GetTypes();
	}
}
