using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UrfuMapsApi.Models
{
	public class Building
	{
		public string Name { get; set; }
		public FloorScheme[] Floors { get; set; }
	}
}
