import { IUser } from "../models/IUser";


export interface IRoom {
  isVoteOpen: boolean;
  host: string;
  roomCode: string;
  users: IUser[];
}
