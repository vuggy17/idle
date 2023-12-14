import { useState } from 'react';

export default function useStateHistory<T>(initialValue: T) {
  const [history, setHistory] = useState([initialValue]);
  const [index, setIndex] = useState(0);

  const state = history[index];
  const setState = (newState: T) => {
    setHistory((histories) => histories.slice(0, index + 1).concat(newState));
    setIndex((idx) => idx + 1);
  };
  const undo = () => setIndex((idx) => idx - 1);
  const redo = () => setIndex((idx) => idx + 1);

  return [
    state,
    setState,
    { history, index, setHistory, setIndex, undo, redo },
  ] as const;
}
