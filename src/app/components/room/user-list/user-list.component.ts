import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { IconRegistry } from '@tylertech/forge';
import { ForgeButtonModule, ForgeCardModule, ForgeIconButtonModule, ForgeIconModule, ForgeTextFieldModule } from '@tylertech/forge-angular';
import { tylIconCheckCircle, tylIconRadioButtonUnchecked } from '@tylertech/tyler-icons/standard';
import { BehaviorSubject, take, tap } from 'rxjs';
import { RoomService } from '../../../shared/services/room.service';


const forgeModules = [ ForgeButtonModule, ForgeCardModule, ForgeIconModule, ForgeTextFieldModule, ForgeIconButtonModule];


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [...forgeModules, NgStyle, NgIf, AsyncPipe, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  private auth = inject(Auth);
  public formGroup = new FormGroup({
    name: new FormControl('')
  });

  colors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'];


  public isEditing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public roomService: RoomService) {
    IconRegistry.define([tylIconCheckCircle, tylIconRadioButtonUnchecked]);
    this.formGroup.valueChanges.subscribe((value) => console.log(value));
  }
  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  public onToggleEdit(index: number): void {
    // if isEditing, return
    this.roomService.users$.pipe(
      take(1),
      tap((users) => {
        // if (this.isEditing.value || this.auth.currentUser?.uid !== users[index].uid) {
        if(this.isEditing.value || '1' !== users[index].uid) {
          return;
        }
        this.isEditing.next(true);
      })
    ).subscribe();
  }

  public onNameEditConfirmClicked(): void {
    this.isEditing.next(false);
    const input = document.getElementById('nameField') as HTMLInputElement;

    // this.roomService.UpdateUserName();
  }
}


