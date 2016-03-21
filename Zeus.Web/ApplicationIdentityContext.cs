using AspNet.Identity.MongoDB;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Zeus.Models;

namespace Zeus
{
    public class ApplicationIdentityContext : IDisposable
	{
		public static ApplicationIdentityContext Create()
		{
            // todo add settings where appropriate to switch server & database in your own application
            var client = new MongoClient(Properties.Settings.Default.ConnectionString);
			var database = client.GetDatabase(Properties.Settings.Default.DatabaseName);
			var users = database.GetCollection<ApplicationUser>("Users");
			var roles = database.GetCollection<IdentityRole>("Roles");
			return new ApplicationIdentityContext(users, roles);
		}

		private ApplicationIdentityContext(IMongoCollection<ApplicationUser> users, IMongoCollection<IdentityRole> roles)
		{
			Users = users;
			Roles = roles;
		}

		public IMongoCollection<IdentityRole> Roles { get; set; }

		public IMongoCollection<ApplicationUser> Users { get; set; }

		public Task<List<IdentityRole>> AllRolesAsync()
		{
			return Roles.Find(r => true).ToListAsync();
		}

        public Task<List<ApplicationUser>> AllUsersAsync()
        {
            return Users.Find(r => true).ToListAsync();
        }

        public void Dispose()
		{
		}
	}
}