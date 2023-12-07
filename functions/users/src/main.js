import { Client, Databases, ID, Query } from 'node-appwrite';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  // Why not try the Appwrite SDK?
  //

  log(req);

  const userID = req.headers['x-appwrite-user-id'];
  const { name, email, phone } = req.body;

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const database = new Databases(client);
  const dbId = '656af2faa9d4d3352a34';
  const collectionId = 'users';

  const documents = await database.listDocuments(dbId, collectionId, [
    Query.equal('authId', userID),
  ]);
  log('documents', documents);

  if (!documents) {
    const newUser = {
      name,
      email,
      phone,
      meta: name + email + phone,
      avatar: '',
      authId: userID,
    };

    await database.createDocument(dbId, collectionId, ID.unique());
  } else {
    // await database.updateDocument(dbId, collectionId, )
    log('update user');
  }

  // If something goes wrong, log an error
  error('Hello, Errors!');
  // The `req` object contains the request data
  if (req.method === 'GET') {
    // Send a response with the res object helpers
    // `res.send()` dispatches a string back to the client
    return res.send('Hello, World!');
  }

  // `res.json()` is a handy helper for sending JSON
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
