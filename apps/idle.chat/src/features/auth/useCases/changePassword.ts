import { UseCase } from 'type';
import {
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
} from 'dto/authDto';
import { UserRepository } from '../repositories/userRepository';

export default class ChangePasswordUseCase
  implements UseCase<ChangePasswordRequestDTO, ChangePasswordResponseDTO>
{
  constructor(private userRepository: UserRepository) {}

  async execute(
    data: ChangePasswordRequestDTO,
  ): Promise<ChangePasswordResponseDTO> {
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     reject(new AppwriteException('assa', 500, 'general_argument_invalid'));
    //   }, 400);
    // });
    /* The commented code is calling the `changePassword` method of the `userRepository` object with the
   `currentPass` and `newPass` parameters. It is assigning the result of this method to the `status`
   variable. However, since this code is commented out, it is not actually being executed. */

    return this.userRepository.changePassword(data.currentPass, data.newPass);
  }
}
