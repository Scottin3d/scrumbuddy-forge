import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ForgeButtonModule, ForgeCardModule, ForgeIconModule, ForgeTabBarModule, ForgeTextFieldModule } from '@tylertech/forge-angular';
import { Observable, from, map, merge } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { RoutingService } from '../../services/routing.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconRegistry } from '@tylertech/forge';
import { tylIconEmoticonSad, tylIconEmoticonHappy } from '@tylertech/tyler-icons/extended';
import { IUser } from '../../models/IUser';
import { Auth } from '@angular/fire/auth';
import { roomCodeValidator } from '../../validators/room-code.validator';
import { IRoom } from '../../models/IRoom';

const forgeModules = [ForgeTabBarModule, ForgeCardModule, FormsModule, ForgeButtonModule, ForgeTextFieldModule, ForgeIconModule];

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [...forgeModules, FormsModule, ReactiveFormsModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    private routingService = inject(RoutingService);
    private roomService = inject(RoomService);
    private auth = inject(Auth);

    readonly roomFormControl: FormGroup;
    readonly displayNameControl: FormControl;
    readonly roomCodeControl: FormControl;

    public activeTabIndex: number = 1;
    roomCodeErrorMessage = signal('');
    displayNameErrorMessage = signal('');
    newRoomCode = signal('ABDC');

    constructor(
    ) {
        IconRegistry.define([tylIconEmoticonSad, tylIconEmoticonHappy]);

        this.roomFormControl = new FormGroup({
            displayNameControl: new FormControl('', [Validators.required]),
            roomCodeControl: new FormControl('', {
                asyncValidators: [roomCodeValidator.bind(this)],
                validators: [
                    Validators.required,
                    Validators.pattern(/^[a-zA-Z0-9]{4}$/),
                ],
            }),
        });

        this.displayNameControl = this.roomFormControl.get(
            'displayNameControl'
        ) as FormControl;
        this.roomCodeControl = this.roomFormControl.get('roomCodeControl') as FormControl;

        this.initDisplayNameErrorMessage();
        this.initRoomCodeErrorMessage();
        this.initNewRoomCode();
    }

    private initDisplayNameErrorMessage(): void {
        merge(
            this.displayNameControl.statusChanges,
            this.displayNameControl.valueChanges
        )
            .pipe(takeUntilDestroyed())
            .subscribe(() =>
                this.displayNameErrorMessage.set(
                    this.displayNameControl.hasError('required')
                        ? 'Display name is required'
                        : ''
                )
            );
    }

    private initRoomCodeErrorMessage(): void {
        merge(
            this.roomCodeControl.statusChanges,
            this.roomCodeControl.valueChanges
        )
            .pipe(takeUntilDestroyed())
            .subscribe(() =>
                this.roomCodeErrorMessage.set(
                    this.roomCodeControl.hasError('required')
                        ? 'Room code is required'
                        : this.roomCodeControl.hasError('pattern')
                            ? 'Room code must be 4 characters'
                            : this.roomCodeControl.hasError('validRoomCode')
                                ? 'Room does not exist'
                                : ''
                )
            );
    }

    private initNewRoomCode(): void {
        this.roomService.generateRoomCode().then((roomCode) => this.newRoomCode.set(roomCode));
    }

    public onTabBarChange(event: CustomEvent): void {
        this.activeTabIndex = event.detail.index;
    }

    public onJoinClick(): void {
        const displayName = this.displayNameControl.value;
        // split the display name by space, if there is more than 2 words the avatar is the first letter of the first two words, else, the avatar is the first two letters of the display name
        const avatar = displayName.split(' ').length > 1 ? displayName.split(' ')[0].charAt(0) + displayName.split(' ')[1].charAt(0) : displayName.slice(0, 2);

        const user: IUser = {
            name: displayName,
            uid: this.auth.currentUser.uid,
            avatar: avatar.toUpperCase(),
            vote: 0
        };

        this.roomService.joinRoom(this.roomCodeControl.value, user).then(() =>
            this.routingService.routeToRoomById(this.roomCodeControl.value));
    }

    public onHostClick(): void {
        const displayName = this.displayNameControl.value;
        const avatar = displayName.split(' ').length > 1 ? displayName.split(' ')[0].charAt(0) + displayName.split(' ')[1].charAt(0) : displayName.slice(0, 2);
        const user: IUser = {
            name: displayName,
            uid: this.auth.currentUser.uid,
            avatar: avatar.toUpperCase(),
            vote: 0
        };

        const room: IRoom = {
            isVoteOpen: true,
            host: user.uid,
            roomCode: this.newRoomCode(),
            users: [user],
        }

        this.roomService.createRoom(room).then(() =>
            this.routingService.routeToRoomById(room.roomCode));
    }

}


