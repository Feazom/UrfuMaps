using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;

namespace UrfuMaps.Api.Test.Repositories
{
	public class EdgeRepositoryMock : IEdgeRepository
	{
		public List<Edge> Edges { get; set; }
		private readonly IPositionRepository _positions;

		public EdgeRepositoryMock(IPositionRepository positionRepository)
		{
			Edges = new();
			_positions = positionRepository;
		}

		public Task Add(Edge edge)
		{
			var result = new TaskCompletionSource();
			try
			{
				if (Edges
					.Select(e => new
					{
						e.FromId,
						e.ToId
					})
					.Contains(new
					{
						edge.FromId,
						edge.ToId
					}))
				{
					var newEdge = (Edge)edge.Clone();
					Edges.Add(newEdge);
					result.SetResult();
				}
				else
				{
					result.SetException(new Exception("duplicate"));
				}
			}
			catch (Exception e)
			{
				result.SetException(e);
			}
			return result.Task;
		}

		public async Task<List<GraphEdge>> GetAll()
		{
			var edges = new List<GraphEdge>();
			foreach (var edge in Edges)
			{
				var fromPosition = await _positions.GetPosition(edge.FromId);
				var toPosition = await _positions.GetPosition(edge.ToId);

				if (fromPosition.Id.HasValue && fromPosition.X.HasValue &&
					fromPosition.Y.HasValue && toPosition.Id.HasValue &&
					toPosition.X.HasValue && toPosition.Y.HasValue)
				{
					edges.Add(new GraphEdge(
						new PositionNode(
							toPosition.Id.Value,
							toPosition.X.Value,
							toPosition.Y.Value),
						new PositionNode(
							toPosition.Id.Value,
							toPosition.X.Value,
							toPosition.Y.Value))
						);
				}
				else
				{
					throw new ArgumentNullException(nameof(fromPosition));
				}
			}
			return edges;
		}
	}
}
