import { ID } from '@idle/model';
import { atom } from 'jotai';

export const NIL = ''; // no room selected
export const currentRoomIdAtom = atom<ID>('');
