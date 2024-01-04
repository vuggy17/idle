import { ID } from '@idle/model';

export default class Message {
  readonly id: ID;

  constructor(
    public author: unknown,
    public text: string,
    public attachments: unknown[],
  ) {
    this.id = 'jdklfjadklfjkl;das;ljk';
  }
}
