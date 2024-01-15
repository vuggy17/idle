/* eslint-disable no-param-reassign */
import { Doc, Map } from 'yjs';
import { bind, JSONObject } from 'immer-yjs';

export default class IdleDoc extends Doc {
  private _rooms: Map<Doc> = this.getMap('rooms');

  getMapProxy<State extends JSONObject>(key: string) {
    const map = super.getMap<State>(key);
    const binder = bind<State>(map);

    return {
      binder,
      proxy: new Proxy(map, {
        has(target, p) {
          return !!binder.get()[p.toString()];
        },
        get(target, p, receiver) {
          return binder.get()[p.toString()];
        },
        set(target, p, newVal, receiver) {
          binder.update((state: any) => {
            state[p.toString()] = newVal;
          });
          return true;
        },
        deleteProperty(target, p) {
          binder.update((state) => {
            delete state[p.toString()];
          });

          return !binder.get()[p.toString()];
        },
      }) as unknown as State,
    };
  }

  get rooms() {
    return this._rooms;
  }
}
