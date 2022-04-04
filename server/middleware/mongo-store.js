import { Shopify } from "@shopify/shopify-api";

const { MONGODB_DB } = process.env;

class MongoStore {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /*
        The storeCallback takes in the Session, and stores it on mongodb
        This callback is used for BOTH saving new Sessions and updating existing Sessions.
        If the session can be stored, return true
        Otherwise, return false
    */
  async storeCallback(session) {
    try {
      await this.mongodb
        .db(MONGODB_DB)
        .collection("__session")
        .updateOne({ id: session.id }, { $set: session }, { upsert: true });
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }

  /*
        The loadCallback takes in the id, and uses the getAsync method to access the session data
        If a stored session exists, it's parsed and returned
        Otherwise, return undefined
    */
  async loadCallback(id) {
    try {
      const mongoSession = await this.mongodb
        .db(MONGODB_DB)
        .collection("__session")
        .findOne({ id: id });

      if (!mongoSession) return false;

      let session = new Shopify.Session.Session(mongoSession.id);
      session = Object.assign(session, mongoSession);
      return session;
    } catch (err) {
      throw new Error(err);
    }
  }

  /*
        The deleteCallback takes in the id, and uses the mongodb `deleteOne` method to delete it from the store
        If the session can be deleted, return true
        Otherwise, return false
    */
  async deleteCallback(id) {
    try {
      await this.mongodb
        .db(MONGODB_DB)
        .collection("__session")
        .deleteOne({ id: id });
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}

// Export the class
export default MongoStore;
