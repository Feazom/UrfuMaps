using System;

namespace UrfuMaps.Api.Models
{
	public class Edge : ICloneable
	{
		public int FromId { get; set; }
		public Position? FromPosition { get; set; }

		public int ToId { get; set; }
		public Position? ToPosition { get; set; }

		public Edge Reverse()
		{
			return new Edge
			{
				FromId = ToId,
				ToId = FromId,
				FromPosition = ToPosition,
				ToPosition = FromPosition
			};
		}

		public override int GetHashCode()
		{
			return Tuple.Create(FromId, ToId).GetHashCode();
		}

		public override bool Equals(object? obj)
		{
			if (obj == null)
			{
				return this == null;
			}
			var another = (Edge)obj;
			return GetHashCode().Equals(another.GetHashCode());
		}

		public object Clone()
		{
			return new Edge
			{
				FromId = FromId,
				ToId = ToId,
				FromPosition = FromPosition,
				ToPosition = ToPosition
			};
		}
	}
}
