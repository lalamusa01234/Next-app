// types/User.ts
export interface User {
  _id: string; // always present if it comes from DB
  fname: string;
  lname: string;
  username: string;
  phone: string;
  email: string;
  password?: string;
}

export type UserFormData = Omit<User, "_id">;
