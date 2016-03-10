using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus
{
    class Program
    {
        static void Main(string[] args)
        {
            using (WebApp.Start<Startup>(url: Properties.Settings.Default.ApiUrl))
            {
                Console.WriteLine("ZEUS API Server Started on {0}...", Properties.Settings.Default.ApiUrl);
                Console.WriteLine("\n\nPress ESC to shutdown");
                ConsoleKeyInfo key;
                do
                {
                    key = Console.ReadKey(true);
                } while (key.Key != ConsoleKey.Escape);
            }
        }
    }
}
