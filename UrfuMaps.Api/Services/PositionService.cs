using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Services
{
	public interface IPositionService
	{
		Task<PositionDTO?> GetPosition(string name);
	}

	public class PositionService : IPositionService
	{
		private readonly IPositionRepository _positions;

		public PositionService(IPositionRepository positions)
		{
			_positions = positions;
		}

		public async Task<PositionDTO?> GetPosition(string name)
		{
			var position = await _positions.GetPosition(name);
			if (position is null)
			{
				return null;
			}
			return position.ToDTO();
		}
	}
}
