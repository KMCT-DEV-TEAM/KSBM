const mongoose = require('mongoose');
const uri = "mongodb://webdev1:web112233@ac-yr7h2g1-shard-00-00.3he8zmw.mongodb.net:27017,ac-yr7h2g1-shard-00-01.3he8zmw.mongodb.net:27017,ac-yr7h2g1-shard-00-02.3he8zmw.mongodb.net:27017/ksbm_db?ssl=true&replicaSet=atlas-7bqscs-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri).then(() => {
  mongoose.connection.db.collection('mbapagesettings').updateMany({}, { $set: { 'academicCalendarBanner.pdfUrl': '/assets/Images/mba/1786339158710-936372878.pdf' } }).then((res) => {
    console.log('Matched:', res.matchedCount, 'Modified:', res.modifiedCount);
    process.exit(0);
  });
});
