using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace UrfuMaps.Api
{
	public class Program
	{
		public static void Main(string[] args)
		{
			CreateHostBuilder(args).Build().Run();
		}

		public static IHostBuilder CreateHostBuilder(string[] args) =>
			Host.CreateDefaultBuilder(args)
				.ConfigureAppConfiguration(AddAppConfiguration)
				.ConfigureWebHostDefaults(webBuilder =>
				{
					webBuilder.UseStartup<Startup>();
				});

		private static void AddAppConfiguration(HostBuilderContext hostBuilderContext, IConfigurationBuilder config)
		{
			if (hostBuilderContext.HostingEnvironment.IsDevelopment())
			{
				config.AddUserSecrets<Program>();
			}
		}
	}
}
