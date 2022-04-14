using System;

namespace UrfuMaps.Api.Models
{
	public class Edge
	{
		public Guid? FromId { get; set; }
		public Position? FromPosition { get; set; }

		public Guid? ToId { get; set; }
		public Position? ToPosition { get; set; }

		public override int GetHashCode()
		{
			return Tuple.Create(FromId, ToId).GetHashCode();
		}

		public override bool Equals(object? obj)
		{
			if (obj == null) {
				return this == null;
			}
			var another = (Edge)obj;
			return GetHashCode().Equals(another.GetHashCode());
		}
	}
}
