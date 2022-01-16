using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UrfuMaps.Api.Controllers
{
	[ApiController]
	[Route("/user")]
	public class UserController : ControllerBase
	{
		[Authorize]
		[HttpGet]
		public ActionResult UserDashboard()
		{
			return Ok();
		}
	}
}
