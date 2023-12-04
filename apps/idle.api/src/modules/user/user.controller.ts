import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  GetUserSearchResultRequestDTO,
  GetUserSearchSuggestionRequestDTO,
  GetUserSearchSuggestionResponseDTO,
} from '@idle/model';
import UserService from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search-suggestions')
  async getUserSearchSuggestions(
    @Query() { q }: GetUserSearchSuggestionRequestDTO,
  ): Promise<GetUserSearchSuggestionResponseDTO> {
    const result = await this.userService.getSearchSuggestions(q);

    return result;
  }

  @Get('search-result')
  async getUserSearchResult(@Query() { q }: GetUserSearchResultRequestDTO) {
    return this.userService.getSearchResult(q);
  }

  @Get('search-result/:id')
  async getSearchResultDetail(@Param('id') userId: string) {
    console.log(
      '🚀 ~ file: user.controller.ts:29 ~ UserController ~ getSearchResultDetail ~ userId:',
      userId,
    );
    const a = await this.userService.getProfile(userId);
    console.log(
      '🚀 ~ file: user.controller.ts:34 ~ UserController ~ getSearchResultDetail ~ a:',
      a,
    );
    return a;
  }
}
