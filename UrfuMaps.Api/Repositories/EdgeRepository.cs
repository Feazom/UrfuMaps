using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using System.Linq;
using System;

namespace UrfuMaps.Api.Repositories
{
	public interface IEdgeRepository
	{
		public Task Add(Edge edge);
		public Task<List<GraphEdge>> GetAll();
		public Task FixMissingEdges();
	}

	public class EdgeRepository : Repository, IEdgeRepository
	{
		public EdgeRepository(AppDbContext context) : base(context) { }

		public Task Add(Edge edge)
		{
			var newEdge = (Edge)edge.Clone();
			_context.Edges.Add(newEdge);
			return _context.SaveChangesAsync();
		}

		public Task FixMissingEdges()
		{
			return _context.Database.ExecuteSqlRawAsync(@"insert into ""Edges"" (""ToId"", ""FromId"")
				select e.""FromId"", e.""ToId""
				from ""Edges"" e
				where(""ToId"", ""FromId"") not in (select ne.""FromId"", ne.""ToId"" from ""Edges"" ne)");
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
					fromPoint.""Type"",
                    toPoint.""Id"",
                    toPoint.""X"",
                    toPoint.""Y"",
					toPoint.""Type""
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
								reader.GetDouble(2),
								reader.GetString(3)
							), new PositionNode(
								reader.GetInt32(4),
								reader.GetDouble(5),
								reader.GetDouble(6),
								reader.GetString(7)
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
