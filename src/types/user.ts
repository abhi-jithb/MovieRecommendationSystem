export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  lastLogin: string;
  createdAt: string;
  status: 'active' | 'suspended' | 'banned';
}