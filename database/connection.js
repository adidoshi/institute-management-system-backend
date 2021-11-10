const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@adidoshi08.k0eou.mongodb.net/manage-users`;

const client = new MongoClient(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function main() {
  try {
    await client.connect();
    console.log(`Mongodb connected successfully to server`);
  } catch (err) {
    console.log(`Error connecting to the database ${err}`);
  } finally {
    await client.close();
  }
}

main().catch((err) => console.log(err));

module.exports = { MONGO_URL, MongoClient };
