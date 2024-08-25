import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, of, take, tap } from 'rxjs';
import { IUser } from '../models/IUser';
import { Auth, Unsubscribe } from '@angular/fire/auth';
import { collection, doc, Firestore, onSnapshot, query, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RoomService implements OnDestroy{
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  public isVoteOpen: Observable<boolean> = of(true);

  public roomSnapshot$: Observable<IRoom> = of({} as IRoom);
  public users$: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
  private roomUnsubscribe: Unsubscribe = () => { };
  private usersUnsubscribe: Unsubscribe = () => { };

  constructor() {
    this.getRoomSnapShot();

    this.users$.subscribe((users) => console.log(users));
  }

  ngOnDestroy(): void {
    this.roomUnsubscribe();
    this.usersUnsubscribe();
  }

  public openVote(): void {
    this.isVoteOpen = of(true);
    this.users$.pipe(
      take(1),
      tap(async (users) => {
        users.forEach((user) => user.vote = -1);

        await updateDoc(doc(this.firestore, 'rooms', 'ikIdXTayNrWOYxQVIoLN8ExHF9J2'), {
          users: users
        });
      })
    ).subscribe();
  }

  public closeVote(): void {
    this.isVoteOpen = of(false);
  }

  public async vote(vote: number): Promise<void> {
    // this index of the vote options

    this.users$.pipe(
      take(1),
      tap(async (users) => {
        // const user = users.find((u) => u.uid === this.auth.currentUser?.uid);
        const user = users.find((u) => u.uid === '1');
        if (user) {
          user.vote = vote;
        }else{
          return;
        }

        await updateDoc(doc(this.firestore, 'rooms', 'ikIdXTayNrWOYxQVIoLN8ExHF9J2'), {
          users: users
        });
      })
    ).subscribe();
  }

  private getRoomSnapShot(): void{
    this.roomUnsubscribe = onSnapshot(
      doc(this.firestore, 'rooms', 'ikIdXTayNrWOYxQVIoLN8ExHF9J2'),
      (doc) => {
        let room: IRoom = doc.data() as IRoom;
        room.uid = doc.id;
        this.roomSnapshot$ = of(room);

        this.users$.next(room.users as IUser[]);
      }
    );

    const q = query(collection(this.firestore, 'rooms', 'ikIdXTayNrWOYxQVIoLN8ExHF9J2', 'users'));

  }
}

export interface IRoom {
  isVoteOpen: boolean;
  uid: string;
  host: string;
  name: string;
  roomCode: string;
  users: IUser[];
}
