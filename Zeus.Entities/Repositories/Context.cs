using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities.Repositories
{
    public class Context
    {
        public MongoDB.Driver.IMongoDatabase Database { get; private set; }
        
        public MongoDbRepository<Facility> Facilities { get; private set; }
        
        #region Static

        public static string ConnectionString { get; private set; }
        public static string DatabaseName { get; private set; }
        private static Context _instance;
        public static Context Instance
        {
            get
            {
                if (_instance == null)
                    _instance = new Context();

                return _instance;
            }
        }

        //Used to block concurent initializations of context
        private static object IsInitializing = new object();

        #endregion

        #region Constructor

        public Context()
        {
            if (string.IsNullOrEmpty(Context.ConnectionString))
            {
                Context.ConnectionString = Properties.Settings.Default.ConnectionString;
                Context.DatabaseName = Properties.Settings.Default.DatabaseName;
            }

            CreateContext();
        }

        public Context(string connectionString, string databaseName)
        {
            Context.ConnectionString = connectionString;
            Context.DatabaseName = databaseName;

            CreateContext();
        }

        private void CreateContext()
        {
            //Lock the creation so every thread must wait the completion of the previous call
            lock (IsInitializing)
            {
                var client = new MongoDB.Driver.MongoClient(Context.ConnectionString);
                Database = client.GetDatabase(Context.DatabaseName);
                
                //Register Mongo collections
                Facilities = new MongoDbRepository<Facility>(this.Database, "Facilities");
                
                //set the static instance property
                _instance = this;
            }
        }

        #endregion
    }
}
