import { Controller, Get, Query } from '@nestjs/common';
import {
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
    return this.userService.getUserSearchSuggestions(q);
  }
}
