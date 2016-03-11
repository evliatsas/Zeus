using Microsoft.Owin;
using Microsoft.Owin.Cors;
using MongoDB.Driver;
using Newtonsoft.Json;
using Owin;
using Serilog;
using System.Web.Http;

[assembly: OwinStartup(typeof(Zeus.Startup))]

namespace Zeus
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration httpConfiguration = new HttpConfiguration();
            Register(httpConfiguration);
            app.UseCors(CorsOptions.AllowAll);
            ConfigureAuth(app);
            app.UseWebApi(httpConfiguration);
        }

        public static void Register(HttpConfiguration config)
        {
            //init DB Contexts
            var context = new Zeus.Entities.Repositories.Context();
            
            //Configure Log
            ConfigureLog(context.Database);

            var jsonSettings = config.Formatters.JsonFormatter.SerializerSettings;
            jsonSettings.TypeNameHandling = TypeNameHandling.Auto;
            
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }

        private static void ConfigureLog(IMongoDatabase db)
        {
            var log = new LoggerConfiguration()
            .WriteTo.MongoDB(db, Serilog.Events.LogEventLevel.Information)
            .CreateLogger();

            Log.Logger = log;
        }
    }
}
