import { Type, Expose, Transform } from 'class-transformer';
import { ID } from '@idle/model';
import { dayjs } from '../utils/dayjs';

export class CockroachEntity {
  id: ID;

  @Type(() => Number)
  @Expose({ name: 'createdAt' })
  @Transform(({ value }) => dayjs(value).unix())
  createdAt: Date;

  @Type(() => Number)
  @Expose({ name: 'updatedAt' })
  @Transform(({ value }) => dayjs(value).unix())
  updatedAt: Date;

  constructor(partial: Partial<CockroachEntity>) {
    Object.assign(this, partial);
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type INTERNAL_ATTRIBUTE_DO_NOT_RETURN<T = never> = T;
