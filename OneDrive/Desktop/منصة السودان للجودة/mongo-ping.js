const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI || '';
if (!uri) {
  console.error('MONGODB_URI not set in backend/.env');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. Successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB ping failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
