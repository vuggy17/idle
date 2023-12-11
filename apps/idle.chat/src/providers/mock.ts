type FriendRequest = {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  isAccepted: boolean;
};

// eslint-disable-next-line import/prefer-default-export
export const mockRequestList: FriendRequest[] = [
  {
    id: '01HGD4JGY8992WDQRV6S1RJD8Q',
    name: 'Bert Gallacher',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: true,
    createdAt: 1676155770,
  },
  {
    id: '01HGD4JGY9842H30NZ5MXZH43Z',
    name: 'Evvie Hoofe',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: false,
    createdAt: 1675518787,
  },
  {
    id: '01HGD4JGYAMZ3T2CHZH6E7185J',
    name: 'Romola Walesa',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: true,
    createdAt: 1683131758,
  },
  {
    id: '01HGD4JGYCG72XYPMVA2058H39',
    name: 'Lynnet McGuiney',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: false,
    createdAt: 1695450104,
  },
  {
    id: '01HGD4JGYD94XZBCH259XC6D9A',
    name: 'Karlee Allmond',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: false,
    createdAt: 1687655918,
  },
  {
    id: '01HGD4JGYEGDRA30XM8T81SJVJ',
    name: 'Dulcine Lavington',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: true,
    createdAt: 1677327436,
  },
  {
    id: '01HGD4JGYFPN5RAMPK0N7SYQDT',
    name: 'Lynnette Rainsbury',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    isAccepted: true,
    createdAt: 1692382620,
  },
  // {
  //   id: '01HGD4JGYGG9Y8YWWZ95F99HF3',
  //   name: 'Tanya Crecy',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: false,
  //   createdAt: 1673138330,
  // },
  // {
  //   id: '01HGD4JGYHJQNK0Q2WJ0VC4KBZ',
  //   name: 'Clemens Bythway',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1681555560,
  // },
  // {
  //   id: '01HGD4JGYJ14AF05XRCPX07GVV',
  //   name: 'Rosemary Moncreiffe',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1676727133,
  // },
  // {
  //   id: '01HGD4JGYKC4300MBPQ5BNRR6K',
  //   name: 'Elva Belle',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1686579978,
  // },
  // {
  //   id: '01HGD4JGYM9GDMH30HAN5W9ZY1',
  //   name: 'Harriot Connaughton',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1683799894,
  // },
  // {
  //   id: '01HGD4JGYNSDAAAGKQC23BXX7P',
  //   name: 'Olvan Scupham',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: false,
  //   createdAt: 1671924814,
  // },
  // {
  //   id: '01HGD4JGYPYCA5PVKJTZHBCJB5',
  //   name: 'Johanna Ricardin',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1700748365,
  // },
  // {
  //   id: '01HGD4JGYQT940YPT7FYYA2DMB',
  //   name: 'Malchy Karslake',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1684618859,
  // },
  // {
  //   id: '01HGD4JGYRFWCJJVQ8GRPYAYDC',
  //   name: 'Davina Bowlands',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1676562973,
  // },
  // {
  //   id: '01HGD4JGYS6TPHN7TXRX1YJT1T',
  //   name: 'Faber Scholz',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1690804252,
  // },
  // {
  //   id: '01HGD4JGYTS7BG1013KVPXBHR4',
  //   name: 'Farrah Diggles',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: false,
  //   createdAt: 1683170049,
  // },
  // {
  //   id: '01HGD4JGYVG5MJWRR5786FMJ4V',
  //   name: 'Barnard Tomaschke',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: false,
  //   createdAt: 1680163437,
  // },
  // {
  //   id: '01HGD4JGYXAV28T6AM4PJ996H3',
  //   name: 'Guglielma Digg',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1676676111,
  // },
  // {
  //   id: '01HGD4JGYY7HKQ8BX8N8PT8H7P',
  //   name: 'Marie-jeanne Burbridge',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1701013730,
  // },
  // {
  //   id: '01HGD4JGYZCDSSY341HK68GCA4',
  //   name: 'Judah Verillo',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1670873982,
  // },
  // {
  //   id: '01HGD4JGZ01QBM9S5DPGJ9BYAV',
  //   name: 'Niall Richardeau',
  //   avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  //   isAccepted: true,
  //   createdAt: 1674188484,
  // },
];
