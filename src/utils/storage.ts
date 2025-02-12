export const clearAll = () => {
  if (typeof window !== "undefined") {
    //TODO REMOVE TOKEN
    localStorage.clear();
  }
};
