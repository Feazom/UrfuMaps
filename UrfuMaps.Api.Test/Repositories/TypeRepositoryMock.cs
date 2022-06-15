using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Test.Repositories
{
	public class TypeRepositoryMock : ITypeRepository
	{
		public List<string> Types { get; set; }

		public TypeRepositoryMock()
		{
			Types = new();
		}

		public Task AddIfNotExist(string type)
		{
			var result = new TaskCompletionSource();
			try
			{
				if (!Types.Contains(type))
				{
					Types.Add(type);
					result.SetResult();
				}
			}
			catch (Exception e)
			{
				result.SetException(e);
			}
			return result.Task;
		}

		public Task<List<string>> GetAll()
		{
			var result = new TaskCompletionSource<List<string>>();
			try
			{
				result.SetResult(Types);
			}
			catch (Exception e)
			{
				result.SetException(e);
			}
			return result.Task;
		}
	}
}
