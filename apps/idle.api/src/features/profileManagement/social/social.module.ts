import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';

@Module({
  imports: [],
  controllers: [PeopleController],
  providers: [],
})
export class SocialModule {}
