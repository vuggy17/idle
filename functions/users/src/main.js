import { Client, Databases, ID, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  try {
    log('Processing with: ');
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

    log('checking if user exists');
    log(`userId, ${userID}`);
    const document = database.getDocument(dbId, collectionId, userID);
    log('result: ');
    log(document);

    const user = {
      name,
      email,
      phone,
      meta: [name, email, phone].join(' '),
      avatar: '',
    };

    if (!document) {
      log('user not existed!, creating new one..');
      const createdDoc = await database.createDocument(
        dbId,
        collectionId,
        userID,
        user,
      );
      log('created doc: ');
      log(createdDoc);
    } else {
      log('user existed, updating..');
      const updatedDoc = await database.updateDocument(
        dbId,
        collectionId,
        user,
      );
      log('updated doc');
      log(updatedDoc);
    }
  } catch (err) {
    error('an error encountered: ');
    error(JSON.stringify(err, null, 4));
    return res.json({
      message: 'Error while executing function',
      error: err.message,
      rawError: JSON.stringify(err),
    });
  }
  log('function executed without any error, exiting..');
  return res.json({
    message: 'Success',
    error: null,
  });
};
