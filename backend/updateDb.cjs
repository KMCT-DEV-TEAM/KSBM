const mongoose = require('mongoose');

async function update() {
  await mongoose.connect('mongodb://webdev1:web112233@ac-yr7h2g1-shard-00-00.3he8zmw.mongodb.net:27017,ac-yr7h2g1-shard-00-01.3he8zmw.mongodb.net:27017,ac-yr7h2g1-shard-00-02.3he8zmw.mongodb.net:27017/ksbm_db?ssl=true&replicaSet=atlas-7bqscs-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0');
  const db = mongoose.connection.db;
  
  await db.collection('mbapages').updateMany({}, { 
    $set: { 
      internshipBgImage: '/assets/Images/mba/gallery_67.png' 
    } 
  });
  
  await db.collection('bbapages').updateMany({}, { 
    $set: { 
      internshipBgImage: '/assets/Images/mba/gallery_67.png' 
    } 
  });

  console.log('Updated db');
  await mongoose.disconnect();
}

update().catch(console.error);
