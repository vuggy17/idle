import { useCallback, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import uniqueId from '../utils/uniqueId';
import Room from '../utils/workspaceState/room';
import { WorkspaceMetadata } from '../utils/workspace/metadata';
import { workspaceManagerAtom } from '../utils/workspace/atom';

const data = [
  {
    id: '-1',
    name: `room ${-1} with long long long long long content`,
    sub: `room ${-1} sub`,
    img: 'room image',
    lastUpdatedAt: 2,
  },
  ...new Array(10).fill({}).map((_, i) => ({
    id: uniqueId(),
    name: `room ${i} with long long long long long content`,
    sub: `room ${i} sub`,
    img: 'room image',
    lastUpdatedAt: 2,
  })),
];

export default function useRoom(meta?: WorkspaceMetadata | null) {
  return [data, () => {}] as const;
}
