import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ForgeButtonModule, ForgeCardModule, ForgeIconModule, ForgeTextFieldModule } from '@tylertech/forge-angular';
import { Observable, from, map, merge } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { RoutingService } from '../../services/routing.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconRegistry } from '@tylertech/forge';
import { tylIconEmoticonSad, tylIconEmoticonHappy } from '@tylertech/tyler-icons/extended';
import { IUser } from '../../models/IUser';
import { Auth } from '@angular/fire/auth';

const forgeModules = [ForgeCardModule, FormsModule, ForgeButtonModule, ForgeTextFieldModule, ForgeIconModule];

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

    readonly joinRoomFormControl: FormGroup;
    readonly displayNameControl: FormControl;
    readonly roomCodeControl: FormControl;

    roomCodeErrorMessage = signal('');
    displayNameErrorMessage = signal('');

    constructor(
    ) {
        IconRegistry.define([tylIconEmoticonSad, tylIconEmoticonHappy]);

        this.joinRoomFormControl = new FormGroup({
            displayNameControl: new FormControl('', [Validators.required]),
            roomCodeControl: new FormControl('', {
                asyncValidators: [this.roomCodeValidator.bind(this)],
                validators: [
                    Validators.required,
                    Validators.pattern(/^[a-zA-Z0-9]{4}$/),
                ],
            }),
        });

        this.displayNameControl = this.joinRoomFormControl.get(
            'displayNameControl'
        ) as FormControl;

        this.roomCodeControl = this.joinRoomFormControl.get('roomCodeControl') as FormControl;

        this.initDisplayNameErrorMessage();
        this.initRoomCodeErrorMessage();
    }

    private initDisplayNameErrorMessage() {
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

    private initRoomCodeErrorMessage() {
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
                            : this.roomCodeControl.hasError('validRoom')
                                ? 'Room does not exist'
                                : ''
                )
            );
    }

    public onJoinClick() {
        const displayName = this.displayNameControl.value;
        const user: IUser = {
            name: displayName,
            uid: this.auth.currentUser.uid,
            avatar: displayName.slice(0, 2).toUpperCase(),
            vote: 0
        };

        this.roomService.AddUserToRoom(user).then(() =>
            this.routingService.routeToRoomById(this.roomCodeControl.value));
    }

    private roomCodeValidator(
        control: AbstractControl
    ): Observable<ValidationErrors | null> {
        const roomCode = control.value;
        return from(this.roomService.validateRoomCode(roomCode)).pipe(
            map((isRoomValid) => {
                console.log('is room valid', isRoomValid);
                return isRoomValid ? null : { validRoom: true };
            })
        );
    }
}

export function length(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value.length !== length) {
            return { length: { requiredLength: length, actualLength: control.value.length } };
        }
        return null;
    };
}
