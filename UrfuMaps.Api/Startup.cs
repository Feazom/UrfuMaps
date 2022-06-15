using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using UrfuMaps.Api.Repositories;
using UrfuMaps.Api.Services;

namespace UrfuMaps.Api
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			var postgresString = Environment.GetEnvironmentVariable("POSTGRES_STRING");
			services.AddDbContext<AppDbContext>(options =>
				options.UseNpgsql(postgresString));
			services.AddControllers();
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "UrfuMaps.Client/build";
			});

			services.AddScoped<IEdgeRepository, EdgeRepository>();
			services.AddScoped<IFloorRepository, FloorRepository>();
			services.AddScoped<IPositionRepository, PositionRepository>();
			services.AddScoped<ITypeRepository, TypeRepository>();
			services.AddScoped<IUserRepository, UserRepository>();
			services.AddScoped<IPrefixRepository, PrefixRepository>();

			services.AddScoped<IUserService, UserService>();
			services.AddScoped<IFloorService, FloorService>();
			services.AddScoped<IRouteService, RouteService>();
			services.AddScoped<IInfoService, InfoService>();
			services.AddScoped<ITypeService, TypeService>();
			services.AddScoped<IPositionService, PositionService>();
			services.AddScoped<IPrefixService, PrefixService>();

			var authOptionsConfiguration = Configuration.GetSection("Auth");
			services.Configure<AuthOptions>(authOptionsConfiguration);

			var authOptions = authOptionsConfiguration.Get<AuthOptions>();
			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options =>
				{
					options.RequireHttpsMetadata = false;
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = true,
						ValidIssuer = authOptions.Issuer,

						ValidateAudience = true,
						ValidAudience = authOptions.Audience,

						ValidateLifetime = true,

						IssuerSigningKey = authOptions.GetSymmetricSecurityKey(),
						ValidateIssuerSigningKey = true,
					};
				});
			services.AddCors();

			services.AddSwaggerGen(options =>
			{
				options.SwaggerDoc("v1", new OpenApiInfo { Title = "UrfuMapsApi", Version = "v3" });
				options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
				{
					Type = SecuritySchemeType.Http,
					Name = "Authorization",
					Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
					In = ParameterLocation.Header,
					Scheme = "Bearer",
					BearerFormat = "JWT"
				});
				options.AddSecurityRequirement(new OpenApiSecurityRequirement {
				{
					new OpenApiSecurityScheme
					{
						Reference = new OpenApiReference
						{
							Type = ReferenceType.SecurityScheme,
							Id = "Bearer"
						}
					},
					Array.Empty<string>()
				}});
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseSwagger();
				app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UrfuMapsApi v1"));
			}

			app.UseRouting();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "UrfuMaps.Client";
			});

			app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
			app.UseAuthentication();
			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}
