const express = require('express');
const app = express();

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
// const uri = process.env.MONGODB_URI;
const uri = 'mongodb+srv://atlasAdmin:Botpassword1@@cluster0.inryrnd.mongodb.net/?retryWrites=true&w=majority'
app.use(express.static('public'));

app.get('/data', async function (req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true});
  try {
    await client.connect();
    const database = client.db('todo');
    const collection = database.collection('_todo');

    const query = { }
    const cursor = await collection.aggregate([
      { $match: query },
      { $project:
        {
          msg: 1,
          time: 1,
          _id: 1,
          status: 1
        }}
    ]);
    const hi = await cursor.toArray();

    return res.json(hi);
  } catch(err) {
    console.log(err);
  }
  finally {
    await client.close();
  }
});

app.get('/add*', async function(req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  // fetch('/add'+inp)
  let parsing = req.url.replace('/add', '');
  parsing = parsing.replaceAll('%20', ' ');

  try {
    await client.connect();
    const database = client.db('todo');
    const collection = database.collection('_todo');

    var obj = {
      msg: parsing,
      time: new Date(),
      status: 0
    };

    console.log(obj);

    collection.insertOne(obj, function(err, res) {
      if (err)
        console.log(err);
      console.log('Inserted');
    });

    // return 'Success';
  } catch(err) {
    console.log(err);
  }


});

app.get('/del*', async function(req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  // fetch('/del'+str)
  let parsing = req.url.replace('/del', '');
  parsing = parsing.replaceAll('%20', ' ');
  console.log('parsing '+parsing);

  try {
    await client.connect();
    const database = client.db('todo');
    const collection = database.collection('_todo');

    var objId = new ObjectId(parsing);
    console.log(objId);

    collection.deleteOne({"_id": objId}, function(err, res) {
      if (err)
        console.log(err);
      console.log('Deleted');
    });

    // return 'Delete';
  } catch(err) {
    console.log(err);
  }

});


app.get('/next*', async function(req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  // fetch('/del'+str)
  let parsing = req.url.replace('/next', '');
  parsing = parsing.replaceAll('%20', ' ');
  console.log('parsing '+parsing);

  try {
    await client.connect();
    const database = client.db('todo');
    const collection = database.collection('_todo');

    let objId = new ObjectId(parsing);

    const query = {"_id": objId}
    const cursor = await collection.aggregate([
      { $match: query },
      { $project:
        {
          msg: 1,
          time: 1,
          _id: 1,
          status: 1
        }}
    ]);
    const hi = await cursor.next();
    // console.log(hi.msg);
    if (hi.status == undefined)
    {
      hi.status = 0;
    }
    else
    {
      hi.status += 1;
    }

    collection.updateOne({"_id": objId},
    { $set: { status: hi.status, time: new Date() }},
    function(err, res) {
      if (err)
        console.log(err);
      console.log('Updated');
    });

    // return 'Next';
  } catch(err) {
    console.log(err);
  }
});


//
// app.listen(process.env.PORT || 3000,
//   () => console.log('Server is running.'));

app.listen(8000,
  () => console.log('Server is up and running.'));






// end
