export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  isActive: boolean;
  password: string; // only for new users
  createdAt: string;
  updatedAt: string;
  avatarUrl: string;
}
