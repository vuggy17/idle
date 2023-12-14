import { PrismaClient } from '@prisma/client';
import mockUsers from '../../../backup/databases/chat-1/users.json';
import { UserEntity } from '../../modules/common/user.entity';

const prisma = new PrismaClient();

async function seedUser() {
  const result = await Promise.all(
    mockUsers.map((user) => prisma.user.create({ data: user })),
  );
  const users: UserEntity[] = result;
  return users;
}

async function seedUserFriend(users: UserEntity[]) {
  return prisma.$transaction([
    prisma.userFriend.createMany({
      data: [
        ...users.map((user) => ({
          userId: user.id,
        })),
      ],
    }),
  ]);
}

async function main() {
  const users = await seedUser();
  await seedUserFriend(users);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
