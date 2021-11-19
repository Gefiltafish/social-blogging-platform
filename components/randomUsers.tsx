export const randomUsers: user[] = [
  {
    id: 1,
    name: "John Doe",
    age: 32,
    job: "developer",
  },
  {
    id: 2,
    name: "Jane Doe",
    age: 31,
    job: "designer",
  },
  {
    id: 3,
    name: "Jim Doe",
    age: 33,
    job: "manager",
  },
  {
    id: 4,
    name: "Janet Doe",
    age: 34,
    job: "developer",
  },
  {
    id: 5,
    name: "Jack Doe",
    age: 35,
    job: "designer",
  },
  {
    id: 6,
    name: "Jill Doe",
    age: 36,
    job: "manager",
  },
];

// create interface for users
export interface user {
  id: number;
  name: string;
  age: number;
  job: string;
}

// filter users by name
export const filterUsersByName = (name: string) => {
  return randomUsers.filter((user) => user.name.includes(name));
};

// add unique id to users array using math.random function
export const addIdToUsers = (users: user[]) => {
  return users.map((user) => {
    return { ...user, id: Math.floor(Math.random() * 100) };
  });
};
