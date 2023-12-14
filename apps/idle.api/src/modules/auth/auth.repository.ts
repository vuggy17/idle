import { Injectable } from '@nestjs/common';
import { ID } from '@idle/model';
import { PrismaProvider } from '../../infra/prisma/prisma.provider';
import { UserEntity } from '../common/user.entity';

@Injectable()
export class AuthRepository {
  constructor(private readonly _prisma: PrismaProvider) {}

  async findUserByAppWriteId(id: ID): Promise<UserEntity> {
    const doc: UserEntity = await this._prisma.user.findFirstOrThrow({
      where: {
        appwriteId: id,
      },
    });

    return new UserEntity(doc);
  }
}
