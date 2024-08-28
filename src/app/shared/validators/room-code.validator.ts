import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable, from, map } from "rxjs";

export function roomCodeValidator(
    control: AbstractControl
): Observable<ValidationErrors | null> {
    const roomCode = control.value;
    return from(this.roomService.validateRoomCode(roomCode)).pipe(
        map((isRoomValid) => {
            return isRoomValid ? null : { validRoomCode: true };
        })
    );
}