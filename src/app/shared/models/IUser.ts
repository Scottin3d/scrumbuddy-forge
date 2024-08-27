export interface IUser {
  name: string;
  uid: string;
  avatar: string;
  vote?: number;
  isAnonymous?: boolean;
  isEmailVerified?: boolean;
  email?: string;
}
