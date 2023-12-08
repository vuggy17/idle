import { Type, Expose, Transform, Exclude } from 'class-transformer';
import { dayjs } from '../utils/dayjs';
import { ID } from '@idle/model';

export class AppwriteEntity {
  @Expose({
    name: 'id',
  })
  $id: ID;

  @Type(() => Number)
  @Expose({ name: 'createdAt' })
  @Transform(({ value }) => dayjs(value).unix())
  $createdAt: string;

  @Type(() => Number)
  @Expose({ name: 'updatedAt' })
  @Transform(({ value }) => dayjs(value).unix())
  $updatedAt: string;

  @Exclude()
  $databaseId: ID;

  @Exclude()
  $collectionId: string;

  @Exclude()
  $permissions: Array<string>;

  constructor(partial: Partial<AppwriteEntity>) {
    Object.assign(this, partial);
  }
}
