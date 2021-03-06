import { MongoClient } from 'mongodb';
//import assert from 'assert';

// Connection URL
const url = `mongodb://localhost:${process.env.DB_DATABASE_PORT}`;
// Database Name
const dbName = process.env.DB_DATABASE_NAME;


const connect = async () => {
  let db = null;
  try {
    const client = await MongoClient.connect(url);
    console.log("Connected correctly to server");
    db = client.db(dbName);    
  } 
  catch (err) {
    console.log(err.stack);
  }     
  return db;
}

export default {

  add: async (docObject, collectionName) => {
    let result;

    try  {
      const db = await connect();
      result = await db.collection(collectionName).insert(docObject);
      return result;
    }
    catch (err) {
      console.log(err.stack);
    }  
  },

  deleteFlag: async (docObject, collectionName) => {
    let result;

    try  {
      const db = await connect();
      var ObjectId = require('mongodb').ObjectID;
      result = await db.collection(collectionName).deleteOne( {_id: new ObjectId(docObject) });
      return result;
    }
    catch (err) {
      console.log(err.stack);
    }  
  },

	
	find: async (searchObject, collectionName) => {
    let client;
    let result;

    try  {
      const db = await connect();
      if(typeof searchObject === 'undefined' || Object.keys(searchObject).length === 0 ) {
        result = await db.collection(collectionName).find({}).toArray();
      }
      else {
        const val = searchObject.displayName;
        const searchObjectWithRegEx = {displayName: { $regex: val + ".*", $options:"i" } }
        result = await db.collection(collectionName).find(searchObjectWithRegEx).toArray();
      }
    }
    catch (err) {
      console.log(err.stack);
    }    
    // Close connection
    if(client)
      client.close();
    return result;
  },


	update: async (searchObject, newObject, collectionName) => {
    let client;
    let result;

    try  {
      const db = await connect();
      var ObjectId = require('mongodb').ObjectID;
      result = await db.collection(collectionName).update( {_id: new ObjectId(searchObject._id)}, newObject );      
    }
    catch (err) {
      console.log(err.stack);
      return false;
    }    
    // Close connection
    if(client)
      client.close();
    return result;
  },  
  
  dropDB: async () => {
    try  {
      const db = await connect();
      db.dropDatabase();
    }
    catch (err) {
      console.log(err.stack);
    }  
  }
}

