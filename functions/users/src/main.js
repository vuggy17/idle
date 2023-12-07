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

    const user = {
      name,
      email,
      phone,
      meta: [name, email, phone].join(' '),
      avatar: '',
      authId: userID,
    };

    if (documents.total === 0) {
      await database.createDocument(dbId, collectionId, ID.unique(), user);
    } else {
      await database.updateDocument(
        dbId,
        collectionId,
        documents.documents[0].$id,
        user,
      );
    }
  } catch (err) {
    error(err);
    return res.json({
      message: 'Error while executing function',
      error: err.message,
    });
  }
  return res.json({
    message: 'Success',
    error: null,
  });
};
