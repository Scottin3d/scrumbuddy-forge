import { IUser } from "../models/IUser";


export interface IRoom {
  isVoteOpen: boolean;
  uid: string;
  host: string;
  name: string;
  roomCode: string;
  users: IUser[];
}
