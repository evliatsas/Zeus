﻿using Microsoft.Owin;
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
            //init DB Contexts
            var context = new Zeus.Entities.Repositories.Context();

            //Configure Auth
            ConfigureAuth(app);

            //Configure Log
            ConfigureLog(context.Database);

            //Configure CORS
            app.UseCors(CorsOptions.AllowAll);

            //Configure OWIN
            app.Map("/api", api =>
            {
                var config = new HttpConfiguration();

                var jsonSettings = config.Formatters.JsonFormatter.SerializerSettings;
                jsonSettings.TypeNameHandling = TypeNameHandling.Auto;

                // Adding JSON Formatter & custom Message Handlers
                //config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
                config.Formatters.Remove(config.Formatters.XmlFormatter);
                // Mapping Routes and starting up WebAPI
                config.MapHttpAttributeRoutes();
                // require authentication for all controllers
                //config.Filters.Add(new AuthorizeAttribute());
                api.UseWebApi(config);
            });
        }

        private void ConfigureLog(IMongoDatabase db)
        {
            var log = new LoggerConfiguration()
            .WriteTo.MongoDB(db, Serilog.Events.LogEventLevel.Information)
            .CreateLogger();

            Log.Logger = log;
        }
    }
}
