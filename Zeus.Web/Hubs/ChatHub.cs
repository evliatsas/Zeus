using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Zeus.Models;
using Zeus.Entities;

namespace Zeus
{
    [Authorize]
    public class ChatHub : Hub
    {
        private Entities.Repositories.Context context;

        public ChatHub()
        {
            context = Entities.Repositories.Context.Instance;
        }

        public static readonly ConcurrentDictionary<string, UserViewModel> Users
            = new ConcurrentDictionary<string, UserViewModel>(StringComparer.InvariantCultureIgnoreCase);

        public async Task Send(string message)
        {
            string sender = Context.User.Identity.Name;
            var chat = await createMessage(message, sender, string.Empty);
            Clients.All.received(chat);
        }

        public async Task Send(string message, string to)
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
                    var chat = await createMessage(message, sender.UserName, cid);
                    Clients.Client(cid).received(chat);
                }
            }
        }

        public void NotifyAll(Priority priority, string title, string message)
        {
            Clients.All.notify(priority, title, message);
        }

        public void NotifyUsers(Priority priority, string title, string message, IEnumerable<string> userIds)
        {
            foreach(var id in userIds)
                Clients.Client(id).notify(priority, title, message);
        }

        public void NotifyUser(Priority priority, string title, string message, string userId)
        {
            Clients.Client(userId).notify(priority, title, message);
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

        public async Task<int> GetUnreadCount()
        {
            return  await context.Chats.Count(t => t.Status == ChatSatus.UnReaded);
        }

        public async Task<IEnumerable<Chat>> GetMessages()
        {
            var ctx = ApplicationIdentityContext.Create();
            var users = await ctx.AllUsersAsync();
            var messages = await context.Chats.Get(t => t.Status != ChatSatus.Archived);
            return messages.Select(t =>
            {
                t.ReceiverName = users.FirstOrDefault().FullName;
                t.SenderName = users.FirstOrDefault().FullName;
                return t;
            });
        }

        public async Task<IEnumerable<Chat>> GetArchives()
        {
            var ctx = ApplicationIdentityContext.Create();
            var users = await ctx.AllUsersAsync();
            var messages = await context.Chats.Get(t => t.Status == ChatSatus.Archived);
            return messages.Select(t =>
            {
                t.ReceiverName = users.FirstOrDefault().FullName;
                t.SenderName = users.FirstOrDefault().FullName;
                return t;
            });
        }

        public async Task<IEnumerable<UserViewModel>> GetUsers()
        {
            var ctx = ApplicationIdentityContext.Create();
            var users = await ctx.AllUsersAsync();
            var c = GetConnectedUsers();
            return users.Where(t=>t.UserName!= Context.User.Identity.Name).Select(t =>
            {
                var u = UserViewModel.Map(t);
                u.Connected = c.Any(x=>x.UserName==u.UserName);
                return u;
            });
        }

        public override Task OnConnected()
        {
            string userName = Context.User.Identity.Name;
            string fullName = ((ClaimsIdentity)Context.User.Identity).Claims.FirstOrDefault(t => t.Type == ClaimTypes.Surname).Value;
            string connectionId = Context.ConnectionId;
            var roles = ((ClaimsIdentity)Context.User.Identity).Claims.Where(t => t.Type == ClaimTypes.Role).Select(t=>t.Value);
            var claims = ((ClaimsIdentity)Context.User.Identity).Claims.Select(t=>new AspNet.Identity.MongoDB.IdentityUserClaim() { Type = t.Type, Value= t.Value});
            var user = Users.GetOrAdd(userName, _ => new UserViewModel
            {
                UserName = userName,
                FullName = fullName,
                Roles = new List<string>( roles),
                Claims = new List<AspNet.Identity.MongoDB.IdentityUserClaim>(claims),
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

        private async Task<Chat> createMessage(string message, string sender, string to)
        {
            Chat chat = new Chat();
            chat.Sender = sender;
            chat.Receiver = to;
            chat.Message = message;
            chat.Send = DateTime.Now;
            chat.Status = ChatSatus.UnReaded;
            await context.Chats.Insert(chat);
            return chat;
        }

        public async Task<Chat> CheckMessage(string id)
        {
            Chat chat = await context.Chats.GetById(id);
            chat.Status = ChatSatus.Readed;
            chat.Oppened = DateTime.Now;
            await context.Chats.Update(chat);
            return chat;
        }

        public async Task<Chat> ArchiceMessage(string id)
        {
            Chat chat = await context.Chats.GetById(id);
            chat.Status = ChatSatus.Archived;
            await context.Chats.Update(chat);
            return chat;
        }
    }
}