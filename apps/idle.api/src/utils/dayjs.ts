import { default as dayjsLocal } from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjsLocal.extend(utc);

export const dayjs = dayjsLocal.utc;
