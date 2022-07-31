export type User = {
  id: string;
  email: string;
};

export interface CurrentUser {
  currentUser: User | null;
}

