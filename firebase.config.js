const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com',
});

const db = admin.firestore();

app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  try {
    const docRef = await db.collection('users').add({
      name,
      email,
    });

    res.status(201).send(`User added with ID: ${docRef.id}`);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Error adding user');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
