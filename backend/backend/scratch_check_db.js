const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGO_URI = "mongodb+srv://daoudtajeldeinn_db_user:9xEajIUAs9eAVg1p@sudanqualityplateform2.hkq9hs1.mongodb.net/sudan_quality_db?retryWrites=true&w=majority";

const questionSchema = new mongoose.Schema({
  unitId: String,
  questionText: { ar: String, en: String },
  category: String
});

const Question = mongoose.model('Question', questionSchema);

async function check() {
  try {
    console.log('Connecting...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');
    
    const count = await Question.countDocuments({ unitId: 'cleaning-validation' });
    console.log(`Total questions for cleaning-validation: ${count}`);
    
    const samples = await Question.find({ unitId: 'cleaning-validation' }).limit(2);
    console.log('Samples:', JSON.stringify(samples, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
