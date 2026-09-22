require('mongoose').connect('mongodb://webdev1:web112233@ac-yr7h2g1-shard-00-00.3he8zmw.mongodb.net:27017,ac-yr7h2g1-shard-00-01.3he8zmw.mongodb.net:27017,ac-yr7h2g1-shard-00-02.3he8zmw.mongodb.net:27017/ksbm_db?ssl=true&replicaSet=atlas-7bqscs-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0').then(async () => { 
  const db = require('mongoose').connection.db; 
  const collection = db.collection('blogspages'); 
  const doc = await collection.findOne({}); 
  if(doc && doc.blogs) { 
    doc.blogs.forEach(b => { 
      if(b.image && b.image.startsWith('blob:')) b.image = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'; 
      if(b.sections) { 
        b.sections.forEach(s => { 
          if(s.inlineImage && s.inlineImage.startsWith('blob:')) s.inlineImage = ''; 
        }); 
      } 
    }); 
    await collection.updateOne({ _id: doc._id }, { $set: { blogs: doc.blogs } }); 
    console.log('Cleaned blogs blob URLs'); 
  } 
  process.exit(0); 
}).catch(console.error);
