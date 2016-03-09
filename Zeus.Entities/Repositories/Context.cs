using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace Zeus.Entities.Repositories
{
    public class Context
    {
        public MongoDB.Driver.IMongoDatabase Database { get; private set; }
        
        public MongoDbRepository<Facility> Facilities { get; private set; }
        public MongoDbRepository<FacilityContact> FacilityContacts { get; private set; }
        public MongoDbRepository<Provider> Providers { get; private set; }
        public MongoDbRepository<ProviderFacility> ProviderFacilities { get; private set; }
        public MongoDbRepository<ProviderContact> ProviderContacts { get; private set; }
        public MongoDbRepository<Person> Persons { get; private set; }
        public MongoDbRepository<Contact> Contacts { get; private set; }
        public MongoDbRepository<Report> Reports { get; private set; }
        public MongoDbRepository<FamilyRelation> FamilyRelations { get; private set; }
        
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
                Providers = new MongoDbRepository<Provider>(this.Database, "Providers");
                ProviderFacilities = new MongoDbRepository<Entities.ProviderFacility>(this.Database, "ProviderFacilities");
                FacilityContacts = new MongoDbRepository<FacilityContact>(this.Database, "FacilityContacts");
                ProviderContacts = new MongoDbRepository<ProviderContact>(this.Database, "ProviderContacts");
                Persons = new MongoDbRepository<Person>(this.Database, "Persons");
                Contacts = new MongoDbRepository<Contact>(this.Database, "Contacts");
                Reports = new MongoDbRepository<Report>(this.Database, "Reports");
                FamilyRelations = new MongoDbRepository<FamilyRelation>(this.Database, "FamilyRelations");
                //set the static instance property
                _instance = this;
            }
        }

        #endregion

        #region Lookup Queries

        public IEnumerable<Lookup> GetFacilitiesLookup()
        {
            var facilities = this.Database.GetCollection<Facility>("Facilities");
            var query = from c in facilities.AsQueryable<Facility>()
                        select new Lookup()
                        {
                            Id = c.Id,
                            Description = c.Name,
                            Tag = c.Type
                        };

            return query.AsEnumerable();
        }

        public IEnumerable<Lookup> GetContactsLookup()
        {
            var contacts = this.Database.GetCollection<Contact>("Contacts");
            var query = from c in contacts.AsQueryable<Contact>()
                        select new Lookup()
                        {
                            Id = c.Id,
                            Description = c.Name,
                            Tag = c.Type
                        };

            return query.AsEnumerable();
        }

        public async Task<IEnumerable<Lookup>> GetProvidersLookup()
        {
            var query = await Instance.Providers.GetAll();
            var list  = query.Select(c=>
                        new Lookup()
                        {
                            Id = c.Id,
                            Description = c.Name,
                            Tag = c.Type.ToString()
                        });

            return list;
        }

        #endregion
    }
}
