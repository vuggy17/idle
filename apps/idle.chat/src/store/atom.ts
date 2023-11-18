import { createStore } from 'jotai';

// global store
const rootStore = createStore();

export default function getCurrentStore() {
  return rootStore;
}
