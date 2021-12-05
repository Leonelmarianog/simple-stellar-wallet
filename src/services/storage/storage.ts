const set = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

const get = (key: string): string | null => {
  return localStorage.getItem(key);
};

const remove = (key: string): void => {
  localStorage.removeItem(key);
};

export { set, get, remove };
