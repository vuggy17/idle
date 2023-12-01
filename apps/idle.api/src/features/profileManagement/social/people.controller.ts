import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppWriteProvider } from '../../../gateways/appwrite.provider';

@Controller('people')
export class PeopleController {
  constructor(private readonly sdk: AppWriteProvider) {}

  @Get()
  async getPeopleSearchSuggestions(@Param() params: {}) {}
}
