export const ids = [1, 20, 30, 40];

ids.push(10);
ids.push(+"100");

/* export const obj = {
  id: "1",
  name: "John",
  age: 23,
}; */

interface User {
  id: number;
  name: string;
  age?: number;
  gender: string | undefined;
}

export const obj: User = {
  id: 1,
  name: "John",
  // age: 23,
  gender: undefined,
};

export const users: User[] = [];

// users.push(1, "2", obj);
users.push(obj);

console.log(users);
