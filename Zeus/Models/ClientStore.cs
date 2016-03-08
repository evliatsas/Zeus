using Microsoft.Owin.Security.DataHandler.Encoder;
using System;
using System.Collections.Concurrent;
using System.Security.Cryptography;

namespace Zeus.Models
{
    public static class ClientsStore
    {
        public static ConcurrentDictionary<string, Client> ClientsList = new ConcurrentDictionary<string, Client>();
        
        static ClientsStore()
        {
            ClientsList.TryAdd("099153c2625149bc8ecb3e85e03f0022",
                                new Client { ClientId = "099153c2625149bc8ecb3e85e03f0022", 
                                                Base64Secret = "IxrAjDoa2FqElO7IhrSrUJELhUckePEPVpaePlS_Xaw", 
                                                Name = "Zeus Api" });
        }

        public static Client AddClient(string name)
        {
            var clientId = Guid.NewGuid().ToString("N");

            var key = new byte[32];
            RNGCryptoServiceProvider.Create().GetBytes(key);
            var base64Secret = TextEncodings.Base64Url.Encode(key);

            Client newClient = new Client { ClientId = clientId, Base64Secret = base64Secret, Name = name };
            ClientsList.TryAdd(clientId, newClient);
            return newClient;
        }

        public static Client FindClient(string clientId)
        {
            Client client = null;
            if (ClientsList.TryGetValue(clientId, out client))
            {
                return client;
            }
            return null;
        }
    }
}