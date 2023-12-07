import { Client, Databases, ID, Query } from 'node-appwrite';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  // Why not try the Appwrite SDK?
  //

  log(req);

  const { name, email, phone, $id } = req.body;
  const userID = $id;

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
  log('documents');
  log(documents);

  if (documents.total === 0) {
    log('new user');
    log(newUser);
    const newUser = {
      name,
      email,
      phone,
      meta: name + email + phone,
      avatar: '',
      authId: userID,
    };

    const savedDoc = await database.createDocument(
      dbId,
      collectionId,
      ID.unique(),
      newUser,
    );
    log('saved doc');
    log(savedDoc);
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
