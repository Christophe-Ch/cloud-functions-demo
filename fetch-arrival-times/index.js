const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

functions.http('helloHttp', async (req, res) => {
  const collection = firestore.collection('arrivalTimes');

  res.send({
    arrivalTimes: (await collection.get()).docs.map(doc => doc.data())
  });
});
