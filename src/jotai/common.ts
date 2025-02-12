import { atomWithStorage } from "jotai/utils";

export const selectedFormState = atomWithStorage("selectedFormState", "normal");

export const collapsedState = atomWithStorage("collapsedState", false);
