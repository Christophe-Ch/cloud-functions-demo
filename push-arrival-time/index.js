const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

functions.http('helloHttp', async (req, res) => {
  const collection = firestore.collection('arrivalTimes');

  const now = new Date();
  const today = new Date(now.toDateString());

  const document = collection.doc(today.getTime().toString());
  document.set({
    timestamp: now - today
  }, { merge: true });
  
  res.send({ success: true });
});
