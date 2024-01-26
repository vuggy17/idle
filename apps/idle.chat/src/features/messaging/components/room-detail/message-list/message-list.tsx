import Message from './message';

const messages = [
  {
    id: 'i8yrcfq3oi95q6hmo2h7on7l',
    content: 'Hi, is this seat taken?',
    author: {
      id: 'a3b0wq5mcp3gxl28fh8vuo2k',
      email: 'personA@gmail.com',
      phone: '',
      name: 'Person A',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 'zj1dq56bpbnwa27jb76eiye9',
    content: 'No, not at all. Please have a seat.',
    author: {
      id: 'e61s3783r8twr7h7zf7knygh',
      email: 'personB@gmail.com',
      phone: '',
      name: 'Person B',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 'qobt3hmaxhqq2yr19i8uh378',
    content: "Thank you. It's quite busy today, isn't it?",
    author: {
      id: 'a3b0wq5mcp3gxl28fh8vuo2k',
      email: 'personA@gmail.com',
      phone: '',
      name: 'Person A',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 'bk92rbzxqvcp41iovhe1d9i8',
    content: 'Yes, it seems like everyone decided to come at the same time.',
    author: {
      id: 'e61s3783r8twr7h7zf7knygh',
      email: 'personB@gmail.com',
      phone: '',
      name: 'Person B',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 'dy49p28ii6yblq45v6sayfs6',
    content: "I guess it's the lunch rush. By the way, I'm Alex.",
    author: {
      id: 'a3b0wq5mcp3gxl28fh8vuo2k',
      email: 'personA@gmail.com',
      phone: '',
      name: 'Person A',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 'u43orlxtvrprlxrnvt8pr5sm',
    content: "Nice to meet you, Alex. I'm Taylor.",
    author: {
      id: 'e61s3783r8twr7h7zf7knygh',
      email: 'personB@gmail.com',
      phone: '',
      name: 'Person B',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 'zp8090fsv5ol4wa7hki8tp0m',
    content: 'Nice to meet you too, Taylor. What are you having?',
    author: {
      id: 'a3b0wq5mcp3gxl28fh8vuo2k',
      email: 'personA@gmail.com',
      phone: '',
      name: 'Person A',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 'wn8u5w3bkbr5cl025y687865',
    content: "I'm just having a coffee. How about you?",
    author: {
      id: 'e61s3783r8twr7h7zf7knygh',
      email: 'personB@gmail.com',
      phone: '',
      name: 'Person B',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 'fdq36x01qrlm367cl90bp58x',
    content:
      "I think I'll get a sandwich and a juice. Would you like anything?",
    author: {
      id: 'a3b0wq5mcp3gxl28fh8vuo2k',
      email: 'personA@gmail.com',
      phone: '',
      name: 'Person A',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 's70w43o7wetcgu2jaoyhh4lh',
    content: "No, I'm good. Thank you for asking, Alex.",
    author: {
      id: 'e61s3783r8twr7h7zf7knygh',
      email: 'personB@gmail.com',
      phone: '',
      name: 'Person B',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 't9gmrugbsw8itveao7mo4k7e',
    content: "You're welcome. It was nice meeting you, Taylor.",
    author: {
      id: 'a3b0wq5mcp3gxl28fh8vuo2k',
      email: 'personA@gmail.com',
      phone: '',
      name: 'Person A',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
  {
    id: 'x4sf693bds3k5geialidzdiv',
    content: 'Likewise, Alex. Enjoy your lunch!',
    author: {
      id: 'e61s3783r8twr7h7zf7knygh',
      email: 'personB@gmail.com',
      phone: '',
      name: 'Person B',
      avatar: '',
      createdAt: 1703238268,
      updatedAt: 1703238268,
    },
  },
];

const isSelf = (id: string) => {
  return id === 'a3b0wq5mcp3gxl28fh8vuo2k';
};
export default function MessageList() {
  return (
    <div>
      {messages.map((m, index) => (
        <Message
          self={isSelf(m.author.id)}
          author={m.author}
          content={m.content}
        />
      ))}
    </div>
  );
}
