import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  GetUserSearchResultRequestDTO,
  GetUserSearchSuggestionRequestDTO,
} from '@idle/model';
import { UserService } from './user.service';
import { UserEntity } from '../common/user.entity';
import { AuthUser } from '../../config/decorators/authUser';
import { Auth } from '../../config/decorators/auth';

@Auth()
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
    return results;
  }

  @Get('search-result')
  async getUserSearchResult(
    @Query() { q }: GetUserSearchResultRequestDTO,
    @AuthUser() user: UserEntity,
  ) {
    return this.userService.getSearchResult(q, user.id);
  }

  @Get('search-result/:id')
  async getSearchResultDetail(
    @Param('id') userId: string,
    @AuthUser() user: UserEntity,
  ) {
    const a = await this.userService.getProfile(userId, user.id);
    return a;
  }
}
