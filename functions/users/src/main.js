import { Client, Databases, ID, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  try {
    const { name, email, phone, $id } = req.body;
    const userID = $id;

    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const database = new Databases(client);
    const dbId = '656af2faa9d4d3352a34';
    const collectionId = 'users';

    // check if user is existed
    const document = database.getDocument(dbId, collectionId, userID);
    log('document');
    log(document);
    const user = {
      name,
      email,
      phone,
      meta: [name, email, phone].join(' '),
      avatar: '',
    };
    log(req);
    log(user);

    if (!document) {
      const createdDoc = await database.createDocument(
        dbId,
        collectionId,
        userID,
        user,
      );
      log('createddoc');
      log(createdDoc);
    } else {
      const savedDoc = await database.updateDocument(dbId, collectionId, user);
      log('saveddoc');
      log(savedDoc);
    }
  } catch (err) {
    error(err);
    return res.json({
      message: 'Error while executing function',
      error: err.message,
      rawError: JSON.stringify(err),
    });
  }
  return res.json({
    message: 'Success',
    error: null,
  });
};
