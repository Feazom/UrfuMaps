using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;

namespace UrfuMaps.Api.Repositories
{
	public class EdgeRepository : Repository, IEdgeRepository
	{
		public EdgeRepository(AppDbContext context) : base(context) { }

		public Task Add(Edge edge)
		{
			var newEdge = (Edge)edge.Clone();
			_context.Edges.Add(newEdge);
			return _context.SaveChangesAsync();
		}

		public async Task<List<GraphEdge>> GetAll()
		{
			var connection = _context.Database.GetDbConnection();
			var result = new List<GraphEdge>();

			using (var command = connection.CreateCommand())
			{
				command.CommandText = @"
				select 
					fromPoint.""Id"",
					fromPoint.""X"",
                    fromPoint.""Y"",
                    toPoint.""Id"",
                    toPoint.""X"",
                    toPoint.""Y""
				from ""Edges""
					join ""Positions"" fromPoint on fromPoint.""Id"" = ""Edges"".""FromId""
					join ""Positions"" toPoint on toPoint.""Id"" = ""Edges"".""ToId""";

				if (connection.State.Equals(ConnectionState.Closed))
				{
					await connection.OpenAsync();
				}

				await using var reader = await command.ExecuteReaderAsync();
				if (reader.HasRows)
				{
					while (await reader.ReadAsync())
					{
						result.Add(new GraphEdge(
							new PositionNode(
								reader.GetInt32(0),
								reader.GetDouble(1),
								reader.GetDouble(2)
							), new PositionNode(
								reader.GetInt32(3),
								reader.GetDouble(4),
								reader.GetDouble(5)
							)
						));
					}
				}
			}

			if (connection.State.Equals(ConnectionState.Open))
			{
				await connection.CloseAsync();
			}

			return result;
		}
	}
}
