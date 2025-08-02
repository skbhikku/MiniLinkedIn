export interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  likes: string[]; // Array of user IDs who liked the post
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}