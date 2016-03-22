using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Zeus.Models;

namespace Zeus
{
    [Authorize]
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, UserViewModel> Users
            = new ConcurrentDictionary<string, UserViewModel>(StringComparer.InvariantCultureIgnoreCase);

        public void Send(string message)
        {

            string sender = Context.User.Identity.Name;

            // So, broadcast the sender, too.
            Clients.All.received(new { sender = sender, message = message, isPrivate = false });
        }

        public void Send(string message, string to)
        {

            UserViewModel receiver;
            if (Users.TryGetValue(to, out receiver))
            {

                UserViewModel sender = GetUser(Context.User.Identity.Name);

                IEnumerable<string> allReceivers;
                lock (receiver.ConnectionIds)
                {
                    lock (sender.ConnectionIds)
                    {

                        allReceivers = receiver.ConnectionIds.Concat(sender.ConnectionIds);
                    }
                }

                foreach (var cid in allReceivers)
                {
                    Clients.Client(cid).received(new { sender = sender.UserName, message = message, isPrivate = true });
                }
            }
        }

        public IEnumerable<UserViewModel> GetConnectedUsers()
        {
            return Users.Where(x =>
            {

                lock (x.Value.ConnectionIds)
                {

                    return !x.Value.ConnectionIds.Contains(Context.ConnectionId, StringComparer.InvariantCultureIgnoreCase);
                }

            }).Select(x => x.Value);
        }

        public override Task OnConnected()
        {
            string userName = Context.User.Identity.Name;
            string fullName = ((ClaimsIdentity)Context.User.Identity).Claims.FirstOrDefault(t => t.Type == ClaimTypes.Surname).Value;
            string connectionId = Context.ConnectionId;

            var user = Users.GetOrAdd(userName, _ => new UserViewModel
            {
                UserName = userName,
                FullName = fullName,
                ConnectionIds = new HashSet<string>()
            });

            lock (user.ConnectionIds)
            {

                user.ConnectionIds.Add(connectionId);

                // // broadcast this to all clients other than the caller
                // Clients.AllExcept(user.ConnectionIds.ToArray()).userConnected(userName, fullName);

                // Or you might want to only broadcast this info if this 
                // is the first connection of the user
                if (user.ConnectionIds.Count == 1)
                {
                    Clients.Others.userConnected(userName, fullName);
                }
            }

            //var mdb = new Repositories.UserConnectionRepository();
            //var task = mdb.AddSignIn(fullName, userName, connectionId);
            //task.ContinueWith(_ => base.OnConnected());
            //return task;
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool b)
        {

            string userName = Context.User.Identity.Name;
            string connectionId = Context.ConnectionId;

            UserViewModel user;
            Users.TryGetValue(userName, out user);

            if (user != null)
            {

                lock (user.ConnectionIds)
                {

                    user.ConnectionIds.RemoveWhere(cid => cid.Equals(connectionId));

                    if (!user.ConnectionIds.Any())
                    {

                        UserViewModel removedUser;
                        Users.TryRemove(userName, out removedUser);

                        // You might want to only broadcast this info if this 
                        // is the last connection of the user and the user actual is 
                        // now disconnected from all connections.
                        Clients.Others.userDisconnected(userName);
                    }
                }
            }

            //var mdb = new Repositories.UserConnectionRepository();
            //var task = mdb.UpdateSignOut(connectionId);
            //task.ContinueWith(_ => base.OnDisconnected(b));
            //return task;
            return base.OnDisconnected(b);
        }

        private UserViewModel GetUser(string username)
        {

            UserViewModel user;
            Users.TryGetValue(username, out user);

            return user;
        }
    }
}