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

    const documents = await database.listDocuments(dbId, collectionId, [
      Query.equal('authId', userID),
    ]);

    log('documents');
    log(documents);

    const user = {
      name,
      email,
      phone,
      meta: name + email + phone,
      avatar: '',
      authId: userID,
    };

    if (documents.total === 0) {
      log('new user');
      log(user);

      const savedDoc = await database.createDocument(
        dbId,
        collectionId,
        ID.unique(),
        user,
      );

      log('saved doc');
      log(savedDoc);
    } else {
      await database.updateDocument(
        dbId,
        collectionId,
        documents.documents[0].$id,
        user,
      );
      log('update user');
    }
  } catch (error) {
    error(error);
    return res.json({
      message: 'Error while executing function',
      error: error.message,
    });
  }
  return res.json({
    message: 'Success',
    error: null,
  });
};
