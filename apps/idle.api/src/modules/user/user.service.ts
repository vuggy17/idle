import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserService {
  constructor() {}

  async getUserSearchSuggestions(q: string) {
    return Promise.resolve([
      {
        id: '01HGJGG9XHQG34P9ZCQZZAN1KA',
        name: 'Dagmar Dinwoodie',
        avatar: 'https://robohash.org/facereporroeum.png?size=50x50&set=set1',
        bio: 'Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.',
        isFriend: true,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9XKDTE96QK3TXFCFQG7',
        name: 'Addy Rattray',
        avatar:
          'https://robohash.org/providentquidemexcepturi.png?size=50x50&set=set1',
        bio: 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.',
        isFriend: false,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9XNMTPMJBKYAXS2BAF1',
        name: 'Meryl Itscovitz',
        avatar:
          'https://robohash.org/etvoluptatestempore.png?size=50x50&set=set1',
        bio: 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
        isFriend: false,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9XPTEXMWCF4CGE077JJ',
        name: 'Anders Weeds',
        avatar: 'https://robohash.org/numquametautem.png?size=50x50&set=set1',
        bio: 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.',
        isFriend: false,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9XR5Z95F20KVP22BBAJ',
        name: 'Merla Crauford',
        avatar:
          'https://robohash.org/quiaveniamrepellat.png?size=50x50&set=set1',
        bio: 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
        isFriend: true,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9XS5598MX8TFK26YF65',
        name: 'Burnaby Seman',
        avatar: 'https://robohash.org/quitemporaex.png?size=50x50&set=set1',
        bio: 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.',
        isFriend: true,
        hasPendingRequest: true,
      },
      {
        id: '01HGJGG9XV3FMDMV4Z919AM43B',
        name: 'Grete Haxby',
        avatar: 'https://robohash.org/placeatharumsed.png?size=50x50&set=set1',
        bio: 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.',
        isFriend: true,
        hasPendingRequest: true,
      },
      {
        id: '01HGJGG9XX575RMNBN7PKMAYDT',
        name: 'Raoul Gregoretti',
        avatar:
          'https://robohash.org/voluptatequibusdamquas.png?size=50x50&set=set1',
        bio: 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.',
        isFriend: false,
        hasPendingRequest: true,
      },
      {
        id: '01HGJGG9XYF8B5DTCTAG5TYQ20',
        name: 'Alberta Sharple',
        avatar:
          'https://robohash.org/inventoredictaconsequatur.png?size=50x50&set=set1',
        bio: 'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.',
        isFriend: true,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9Y0R6SZZTEVAVZDD456',
        name: 'Reinaldo Scohier',
        avatar: 'https://robohash.org/etipsumoccaecati.png?size=50x50&set=set1',
        bio: 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.',
        isFriend: false,
        hasPendingRequest: true,
      },
      {
        id: '01HGJGG9Y190ZX8WBY9VFXEF4T',
        name: 'Francyne Greatbach',
        avatar:
          'https://robohash.org/sintmolestiaevoluptas.png?size=50x50&set=set1',
        bio: 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.',
        isFriend: false,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9Y2QZ2GP2Y3TCW6NGFT',
        name: 'Liesa Kmicicki',
        avatar: 'https://robohash.org/etremautem.png?size=50x50&set=set1',
        bio: 'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.',
        isFriend: true,
        hasPendingRequest: true,
      },
      {
        id: '01HGJGG9Y4KZDK8R5PGKYXZPYT',
        name: 'Buckie Eyckelberg',
        avatar:
          'https://robohash.org/eligendivoluptatemcum.png?size=50x50&set=set1',
        bio: 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.',
        isFriend: true,
        hasPendingRequest: true,
      },
      {
        id: '01HGJGG9Y6N0F0C9KSW2EW4QAR',
        name: 'Patrizia Greber',
        avatar: 'https://robohash.org/magniquiaa.png?size=50x50&set=set1',
        bio: 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.',
        isFriend: false,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9Y7M6K1KHZ9TAN1V10T',
        name: 'Kirstin Flowitt',
        avatar:
          'https://robohash.org/repudiandaequoaut.png?size=50x50&set=set1',
        bio: 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.\n\nSed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.',
        isFriend: false,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9Y918STH5EGE6M668RN',
        name: 'Fred Danzey',
        avatar:
          'https://robohash.org/dolorumquodconsequatur.png?size=50x50&set=set1',
        bio: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.',
        isFriend: false,
        hasPendingRequest: true,
      },
      {
        id: '01HGJGG9YATP3ZN3KCNQW0YM3B',
        name: 'Donella Hellis',
        avatar:
          'https://robohash.org/nemoquivoluptatem.png?size=50x50&set=set1',
        bio: 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.',
        isFriend: false,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9YBWGRW2Y24VN77WSVN',
        name: 'Margit Stillwell',
        avatar:
          'https://robohash.org/quisquamquiaomnis.png?size=50x50&set=set1',
        bio: 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.',
        isFriend: true,
        hasPendingRequest: false,
      },
      {
        id: '01HGJGG9YC7D7T4NAFF5ZDF38Y',
        name: 'Geri Froude',
        avatar: 'https://robohash.org/utvelexpedita.png?size=50x50&set=set1',
        bio: 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.',
        isFriend: false,
        hasPendingRequest: true,
      },
      {
        id: '01HGJGG9YD133CR2VTNB14HH0P',
        name: 'Winnie Tibbits',
        avatar:
          'https://robohash.org/temporibusoptioet.png?size=50x50&set=set1',
        bio: 'Sed ante. Vivamus tortor. Duis mattis egestas metus.\n\nAenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
        isFriend: true,
        hasPendingRequest: false,
      },
    ]);
  }
}
