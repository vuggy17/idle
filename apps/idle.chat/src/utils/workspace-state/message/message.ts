import * as Y from 'yjs';
import { bind } from 'immer-yjs';
import { ID } from '@idle/model';
import { assertExists } from '../../assert';

export type YMessage = Y.Map<unknown>;

export class Message {
  readonly id: ID;

  readonly version: number;

  readonly props: unknown;

  constructor(private readonly yMessage: YMessage) {
    const { id, version, props } = this._parseYMessage();
    this.id = id;
    this.version = version;
    this.props = props;
  }

  private _parseYMessage() {
    let id: string | undefined;
    let version: number | undefined;
    const props: Record<string, unknown> = {};

    const binder = bind(this.yMessage);

    Object.entries(binder.get()).forEach(([key, value]) => {
      if (key.startsWith('prop:')) {
        const keyName = key.replace('prop:', '');
        props[keyName] = value;
        return;
      }
      if (key === 'sys:id' && typeof value === 'string') {
        id = value;
        return;
      }
      if (key === 'sys:version' && typeof value === 'number') {
        version = value;
      }
    });

    assertExists(id, 'Message id is not found');
    assertExists(version, 'Message version is not found');

    binder.unbind();
    return {
      id,
      version,
      props,
    };
  }
}
