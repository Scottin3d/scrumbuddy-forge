import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  isObservable,
  map,
  Observable,
  of,
  take,
  tap,
} from 'rxjs';
import { IUser } from '../models/IUser';
import { Auth, Unsubscribe } from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { IRoom } from '../models/IRoom';

@Injectable({
  providedIn: 'root',
})
export class RoomService implements OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private _validRoom: BehaviorSubject<IRoom> = new BehaviorSubject<IRoom>(null);
  public room$: BehaviorSubject<IRoom> = new BehaviorSubject<IRoom>(null);
  public users$: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
  public votes$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]); // a distribution of votes
  public amHost$: Observable<boolean> = of(false);
  private roomUnsubscribe: Unsubscribe = () => {};
  private usersUnsubscribe: Unsubscribe = () => {};

  constructor() {
    this.getRoomSnapShot();
    // this.room$.subscribe((room) => console.table(room));
    // this.users$.subscribe((users) => console.table(users));
    // this.votes$.subscribe((votes) => console.log('votes: ' + votes));
  }

  ngOnDestroy(): void {
    this.roomUnsubscribe();
    this.usersUnsubscribe();
  }

  public openVote(): void {
    console.log('opening vote');
    this.users$
      .pipe(
        take(1),
        tap(async (users) => {
          users.forEach((user) => (user.vote = 0));

          await updateDoc(
            doc(this.firestore, 'rooms', 'ikIdXTayNrWOYxQVIoLN8ExHF9J2'),
            {
              users: users,
              isVoteOpen: true,
            }
          );
        })
      )
      .subscribe();
  }

  public closeVote(): void {
    updateDoc(doc(this.firestore, 'rooms', 'ikIdXTayNrWOYxQVIoLN8ExHF9J2'), {
      isVoteOpen: false,
    });
  }

  public async vote(vote: number): Promise<void> {
    // this index of the vote options

    combineLatest([this.users$, this.room$])
      .pipe(
        take(1),
        tap(async ([users, room]) => {
          const user = users.find((u) => u.uid === this.auth.currentUser?.uid);
          if (user) {
            user.vote = vote;
          } else {
            return;
          }

          await updateDoc(doc(this.firestore, 'rooms', room.uid), {
            users: users,
          });
        })
      )
      .subscribe();
  }

  private getRoomSnapShot(): void {
    this.roomUnsubscribe = onSnapshot(
      doc(this.firestore, 'rooms', 'ikIdXTayNrWOYxQVIoLN8ExHF9J2'),
      (doc) => {
        let room: IRoom = doc.data() as IRoom;
        room.uid = doc.id;
        this.room$.next(room as IRoom);

        // get users
        this.users$.next(room.users as IUser[]);

        // determine host
        this.amHost$ =
          this.auth.currentUser?.uid === room.host ? of(true) : of(false);
        // this.amHost$ = of(true);

        const votingOptions = [
          'pass',
          '1',
          '2',
          '3',
          '5',
          '8',
          '13',
          '21',
          '34',
          '55',
          '89',
        ];
        // get votes
        // get votes from users, and distribute them compared to the voting options
        // user vote is index of the voting options
        const votes = room.users.map((user) => user.vote);
        const distribution = votingOptions.map(
          (option) =>
            votes.filter((vote) => vote === votingOptions.indexOf(option))
              .length
        );
        this.votes$.next(distribution);
      }
    );
  }

  public async validateRoomCode(roomCode: string): Promise<boolean> {
    const querySnapshot = await getDocs(collection(this.firestore, 'rooms'));
    const regex = /^[a-zA-Z0-9]{4}$/;
    let isValidRoom = false;
    querySnapshot.forEach((doc) => {
      const room: IRoom = doc.data() as IRoom;
      if (
        room.roomCode.trim().toLocaleLowerCase() ===
          roomCode.trim().toLocaleLowerCase() &&
        regex.test(roomCode)
      ) {
        isValidRoom = true;
        this._validRoom.next(room);
        // break foreach
        return;
      }
    });
    this._validRoom.next(null);
    return isValidRoom;
  }

  public async AddUserToRoom(user: IUser): Promise<void> {
    this.room$
      .pipe(
        take(1),
        tap(async (room) => {
          room.users.push(user);
          await updateDoc(
            doc(this.firestore, 'rooms', 'ikIdXTayNrWOYxQVIoLN8ExHF9J2'),
            {
              users: room.users,
            }
          );
        })
      )
      .subscribe();
    return;
  }

  public async LeaveRoom(): Promise<void> {
    this.room$
      .pipe(
        take(1),
        tap(async (room) => {
          // if room is empty, return
          if (room === null) return;

          // remove user from room
          const users = room.users.filter(
            (user) => user.uid !== this.auth.currentUser?.uid
          );

          // check if user is host, if so, assign to next user
          const host =
            room.host === this.auth.currentUser?.uid ? users[0].uid : room.host;

          // update doc
          await updateDoc(
            doc(this.firestore, 'rooms', 'ikIdXTayNrWOYxQVIoLN8ExHF9J2'),
            {
              users: users,
              host: host,
            }
          );
        })
      )
      .subscribe();
  }
}
