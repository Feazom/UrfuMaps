using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using UrfuMaps.Api.Models;
using UrfuMaps.Api.Repositories;
using BC = BCrypt.Net.BCrypt;

namespace UrfuMaps.Api.Services
{
	public interface IUserService
	{
		Task<User?> Authenticate(User user);
		Task Register(User user);
		string GenerateJWT(User user);
	}

	public class UserService : IUserService
	{
		private readonly IUserRepository _users;
		private readonly IOptions<AuthOptions> _authOptions;

		public UserService(IUserRepository users, IOptions<AuthOptions> authOptions)
		{
			_users = users;
			_authOptions = authOptions;
		}

		public async Task<User?> Authenticate(User user)
		{
			var account = await _users.Find(user.Login);

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

			await _users.Add(account);
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
