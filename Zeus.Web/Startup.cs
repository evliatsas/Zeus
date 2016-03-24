using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using MongoDB.Driver;
using Newtonsoft.Json;
using Owin;
using Serilog;
using System.Web.Http;
using Hangfire;
using Hangfire.Mongo;
using System;

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
            ConfigureHangfire(app);
            app.UseWebApi(httpConfiguration);

            app.Map("/signalr", map =>
            {
                map.UseCors(CorsOptions.AllowAll);

                map.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions()
                {
                    Provider = new QueryStringOAuthBearerProvider()
                });

                var hubConfiguration = new HubConfiguration
                {
                    Resolver = GlobalHost.DependencyResolver,
                };
                map.RunSignalR(hubConfiguration);
            });
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
            
        }

        private static void ConfigureLog(IMongoDatabase db)
        {
            var log = new LoggerConfiguration()
            .WriteTo.MongoDB(db, Serilog.Events.LogEventLevel.Information)
            .CreateLogger();

            Log.Logger = log;
        }

        private void ConfigureHangfire(IAppBuilder app)
        {
            Hangfire.GlobalConfiguration.Configuration.UseMongoStorage(
                Properties.Settings.Default.ConnectionString,
                Properties.Settings.Default.DatabaseName,
                new MongoStorageOptions()
                {
                    Prefix = "Jobs",
                    CountersAggregateInterval = TimeSpan.FromMinutes(5),
                    JobExpirationCheckInterval = TimeSpan.FromMinutes(15)
                });

            app.UseHangfireServer();
            app.UseHangfireDashboard();

            //Configure Reccuring Jobs
            // Update from HRM every day at 01:00 UTC
            RecurringJob.AddOrUpdate("Expired Operations", () =>
                    Helper.CheckExpiredOperations()
                , "0/30 * * * *");
        }
    }
}
