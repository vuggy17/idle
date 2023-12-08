import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  GetUserSearchResultRequestDTO,
  GetUserSearchSuggestionRequestDTO,
  GetUserSearchSuggestionResponseDTO,
} from '@idle/model';
import UserService from './user.service';
import { UserEntity } from './entities';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   *
   * @param param0
   * @returns {Promise<GetUserSearchSuggestionResponseDTO>} result
   */
  @Get('search-suggestions')
  async getUserSearchSuggestions(
    @Query() { q }: GetUserSearchSuggestionRequestDTO,
  ) {
    const results = await this.userService.getSearchSuggestions(q);
    return results.map((user) => new UserEntity(user));
  }

  @Get('search-result')
  async getUserSearchResult(@Query() { q }: GetUserSearchResultRequestDTO) {
    return this.userService.getSearchResult(q);
  }

  @Get('search-result/:id')
  async getSearchResultDetail(@Param('id') userId: string) {
    const a = await this.userService.getProfile(userId);
    return a;
  }
}
