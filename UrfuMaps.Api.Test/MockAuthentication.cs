namespace UrfuMaps.Api.Test
{
	//public static class MockAuthentication
	//{
	//    public HttpClient Client { get; set; }

	//    public MockAuthentication()
	//    {
	//        var builder = new WebHostBuilder()
	//            .UseStartup<Startup>()
	//            .ConfigureTestServices(services =>
	//            {
	//                services.AddTransient<IOrderRetriever, MockOrderRetriever>();
	//            })
	//            .ConfigureServices(services =>
	//            {
	//                services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
	//                {
	//                    options.TokenValidationParameters = new TokenValidationParameters()
	//                    {
	//                        SignatureValidator = (token, parameters) => new JwtSecurityToken(token)
	//                    };
	//                    options.Audience = TestAuthorisationConstants.Audience;
	//                    options.Authority = TestAuthorisationConstants.Issuer;
	//                    options.BackchannelHttpHandler = new MockBackchannel();
	//                    options.MetadataAddress = "https://inmemory.microsoft.com/common/.well-known/openid-configuration";
	//                });
	//            });

	//        var server = new TestServer(builder);

	//        Client = server.CreateClient();
	//        Client.BaseAddress = new Uri("http://localhost:5012");
	//    }
	//}
}
