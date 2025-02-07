import dayjs, { Dayjs } from "dayjs";
import { atom } from "jotai";

export const dateRangeState = atom<[Dayjs, Dayjs]>([
  dayjs().add(-30, "d"),
  dayjs().add(-1, "d"),
]);
