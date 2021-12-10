using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using BC = BCrypt.Net.BCrypt;

namespace UrfuMaps.Api.Services
{
	public class UserService : IUserService
	{
		private readonly AppDbContext _db;
		private readonly IOptions<AuthOptions> _authOptions;

		public UserService(AppDbContext context, IOptions<AuthOptions> authOptions)
		{
			_db = context;
			_authOptions = authOptions;
		}

		public async Task<User?> Authenticate(User user)
		{
			var account = await _db.Users.FindAsync(user.Login);

			if (account == null || !BC.Verify(user.Password, account.Password, true, BCrypt.Net.HashType.SHA256))
			{
				return null;
			}
			return account;
		}

		public async Task Register(User user)
		{
			var account = new User(
				user.Login,
				BC.HashPassword(
					user.Password,
					BC.GenerateSalt(4),
					true,
					BCrypt.Net.HashType.SHA256));

			_db.Users.Add(account);
			await _db.SaveChangesAsync();
		}

		public string GenerateJWT(User user)
		{
			var authParams = _authOptions.Value;

			var securiryKey = authParams.GetSymmetricSecurityKey();
			var credenctials = new SigningCredentials(securiryKey, SecurityAlgorithms.HmacSha256);

			var claims = new List<Claim>() {
				new Claim(JwtRegisteredClaimNames.UniqueName, user.Login),
			};

			var token = new JwtSecurityToken(
				authParams.Issuer,
				authParams.Audience,
				claims,
				expires: DateTime.Now.AddSeconds(authParams.TokenLifetime),
				signingCredentials: credenctials);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
