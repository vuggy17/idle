import { createStore } from 'jotai';

// global store
const rootStore = createStore();

export function getCurrentStore() {
  return rootStore;
}
