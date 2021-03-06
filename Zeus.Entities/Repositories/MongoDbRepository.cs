﻿using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Zeus.Entities.Repositories
{
    public class MongoDbRepository<T> where T : Entity
    {
        protected internal IMongoCollection<T> collection;

        public IMongoCollection<T> Collection { get { return collection; } }

        public MongoDbRepository(IMongoDatabase database, string collectionName)
        {
            this.collection = database.GetCollection<T>(collectionName);
        }
        
        public virtual async Task<T> GetById(string id)
        {
            var filter = Builders<T>.Filter.Eq("Id", id);
            var query = await collection.FindAsync(filter);
            var result = await query.ToListAsync();
            return result.FirstOrDefault();
        }

        public virtual async Task<T> Insert(T entity)
        {
            await collection.InsertOneAsync(entity);

            return entity;
        }

        public virtual async Task<T> Update(T entity)
        {
            var _id = ObjectId.Parse(entity.Id);
            var filter = Builders<T>.Filter.Eq("Id", entity.Id);
            var result = await collection.ReplaceOneAsync(filter, entity);

            return entity;
        }

        public virtual async Task<bool> UpdateMany(FilterDefinition<T> filter, UpdateDefinition<T> update)
        {
            var result = await collection.UpdateManyAsync(filter, update);

            return result.MatchedCount == result.ModifiedCount;
        }

        public virtual async Task<IEnumerable<T>> BulkInsert(IEnumerable<T> entities)
        {
            if (entities == null || entities.Count() == 0)
                return new List<T>().AsEnumerable();
            else
            {
                await collection.InsertManyAsync(entities);
                return entities;
            }
        }

        public virtual async Task<bool> Delete(string id)
        {
            var filter = Builders<T>.Filter.Eq("Id", id);
            var result = await collection.DeleteOneAsync(filter);

            return result.IsAcknowledged && result.DeletedCount == 1;
        }

        public virtual async Task<bool> DeleteAll()
        {
            var result = await collection.DeleteManyAsync(x => true);

            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        public virtual async Task<bool> Delete(T entity)
        {
            return await this.Delete(entity.Id);
        }

        public virtual async Task<bool> Delete(Expression<Func<T, bool>> predicate)
        {
            var result = await collection.DeleteManyAsync(predicate);

            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        public async Task<IEnumerable<T>> GetAll()
        {
            var documents = await this.collection.FindAsync(x => true);
            var result = await documents.ToListAsync();

            return result;
        }

        public async Task<IEnumerable<T>> Get(Expression<Func<T, bool>> predicate)
        {
            var documents = await this.collection.FindAsync(predicate);
            var result = await documents.ToListAsync();

            return result;
        }

        public async Task<IEnumerable<T>> Get(FilterDefinition<T> filter)
        {
            var documents = await this.collection.FindAsync(filter);
            var result = await documents.ToListAsync();

            return result;
        }

        public async Task<int> Count(Expression<Func<T, bool>> predicate)
        {
            var count = await this.collection.CountAsync(predicate);
            return (int)count;
        }        
    }
}
