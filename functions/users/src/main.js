import { Client, Databases, ID, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  log('Processing with: ');
  log(req);

  const { name, email, phone, $id } = req.body;
  const userID = $id;

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const database = new Databases(client);
  const dbId = 'chat-1';
  const collectionId = 'users';
  const userFriendCollectionID = 'user-friends';
  const user = {
    name,
    email,
    phone,
    meta: [name, email, phone].join(' '),
    avatar: '',
  };

  try {
    log('checking if user exists');
    log(`userId, ${userID}`);
    const document = await database.getDocument(dbId, collectionId, userID);
    log('result: ');
    log(JSON.stringify(document, null, 4));

    log('user existed, updating..');
    const updatedDoc = await database.updateDocument(
      dbId,
      collectionId,
      userID,
      user,
    );
    log('updated doc');
    log(JSON.stringify(updatedDoc, null, 4));
  } catch (err) {
    if (err.type == 'document_not_found' && err.code == 404) {
      log('user not exist!, creating new one..');
      const createdDoc = await database.createDocument(
        dbId,
        collectionId,
        userID,
        user,
      );
      log('created doc: ');

      log('creating user-friend record');
      await database.createDocument(dbId, userFriendCollectionID, userID, {
        user: userID,
        friends: [],
      });
      log(JSON.stringify(createdDoc, null, 4));
    } else {
      error('an error encountered: ');
      error(JSON.stringify(err, null, 4));
      return res.json({
        message: 'Error while executing function',
        error: err.message,
        rawError: JSON.stringify(err),
      });
    }
  }
  log('function executed without any error, exiting..');
  return res.json({
    message: 'Success',
    error: null,
  });
};
