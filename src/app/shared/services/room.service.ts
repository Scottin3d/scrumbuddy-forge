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
    addDoc,
    collection,
    doc,
    Firestore,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
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
    private roomUnsubscribe: Unsubscribe = () => { };
    private usersUnsubscribe: Unsubscribe = () => { };

    constructor() {
        // this.getRoomSnapShot();
        this.room$.subscribe((room) => console.table(room));
        this.users$.subscribe((users) => console.table(users));
        this.votes$.subscribe((votes) => console.log('votes: ' + votes));
    }

    ngOnDestroy(): void {
        this.roomUnsubscribe();
        this.usersUnsubscribe();
    }

    public openVote(): void {
        combineLatest([this.users$, this.room$])
            .pipe(
                take(1),
                tap(async ([users, room]) => {
                    users.forEach((user) => (user.vote = 0));

                    await updateDoc(
                        doc(this.firestore, 'rooms', room.roomCode),
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
        this.room$.pipe(take(1), tap((room) =>
            updateDoc(doc(this.firestore, 'rooms', room.roomCode), {
                isVoteOpen: false,
            }))).subscribe();
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

                    await updateDoc(doc(this.firestore, 'rooms', room.roomCode), {
                        users: users,
                    });
                })
            )
            .subscribe();
    }

    private getRoomSnapShot(ref): void {
        this.roomUnsubscribe = onSnapshot(
            ref,
            (doc) => {
                let room: IRoom = doc.data() as IRoom;
                this.room$.next(room as IRoom);

                // get users
                this.users$.next(room.users as IUser[]);

                // determine host
                this.amHost$ =
                    this.auth.currentUser?.uid === room.host ? of(true) : of(false);
                // this.amHost$ = of(true);

                // this will eventually be a configurable setting
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

    public async leaveRoom(): Promise<void> {
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
                    // if no users, skip
                    let host = '';
                    if (users.length > 0) {
                        host = room.host === this.auth.currentUser?.uid ? users[0].uid : room.host;
                    }
                    // update doc
                    await updateDoc(
                        doc(this.firestore, 'rooms', room.roomCode),
                        {
                            users: users === null ? [] : users,
                            host: host,
                        }
                    );
                })
            )
            .subscribe();
    }

    public async generateRoomCode(length: number = 4): Promise<string> {
        const keyChars: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        let code: string;
        do {
            code = Array.from(
                { length: length },
                () => keyChars[Math.floor(Math.random() * keyChars.length)]
            ).join('');
        } while (!this.validateRoomCode(code));
        return code;
    }

    public async createRoom(room: IRoom): Promise<void> {
        const ref = doc(this.firestore, 'rooms', room.roomCode);

        // add a timestamp to the room
        let roomWithTimestamp = { ...room, createdAt: Timestamp.now() };
        await setDoc(ref, roomWithTimestamp).then(() => {
            this.room$.next(room);
            this.getRoomSnapShot(ref);
        });
    }

    public async joinRoom(roomCode: string, user: IUser): Promise<void> {
        const ref = doc(this.firestore, 'rooms', roomCode);
        await getDoc(ref).then((doc) => {
            if (doc.exists()) {
                this.getRoomSnapShot(ref);
                this.AddUserToRoom(ref, user);
            }
        });
    }

    public async AddUserToRoom(ref, user: IUser): Promise<void> {
        this.room$
            .pipe(
                take(1),
                tap(async (room) => {
                    // if users is undefined, create a new array
                    room.users.push(user);
                    await updateDoc(ref, { users: room.users });
                })
            )
            .subscribe();
    }
}
