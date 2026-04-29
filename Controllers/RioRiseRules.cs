using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AmiLabsZero.Controllers
{
    public class RioRiseRulesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
