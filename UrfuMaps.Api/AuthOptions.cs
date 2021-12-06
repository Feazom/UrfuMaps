using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

namespace UrfuMaps.Api
{
	public class AuthOptions
	{
		public string? Issuer { get; set; }
		public string? Audience { get; set; }
		public string? Secret { get; set; }
		public int TokenLifetime { get; set; }

		public SymmetricSecurityKey GetSymmetricSecurityKey()
		{
			if (Secret == null)
			{
				throw new NullReferenceException();
			}

			return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Secret));
		}
	}
}
