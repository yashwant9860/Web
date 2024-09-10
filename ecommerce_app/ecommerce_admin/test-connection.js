const { MongoClient } = require('mongodb');
require('dotenv').config(); // Ensure this line is included to load the environment variables

async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    return;
  }

  console.log('Using MongoDB URI:', uri);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (e) {
    console.error("Failed to connect:", e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
