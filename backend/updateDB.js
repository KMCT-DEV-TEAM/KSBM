const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ksbm').then(async () => {
  const db = mongoose.connection.db;
  await db.collection('placementpages').updateMany({}, { $set: { 'placementCommittee.buttonText': 'View Committee' } });
  console.log('Updated!');
  mongoose.disconnect();
});
