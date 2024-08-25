import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { ForgeButtonModule, ForgeCardModule, ForgeIconModule } from '@tylertech/forge-angular';
import { IconRegistry } from '@tylertech/forge';
import { tylIconCheckCircle, tylIconRadioButtonUnchecked } from '@tylertech/tyler-icons/standard';
import { RoomService } from '../../../shared/services/room.service';
import { IUser } from '../../../shared/models/IUser';
const forgeModules = [ ForgeButtonModule, ForgeCardModule, ForgeIconModule];


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [...forgeModules, NgStyle, NgIf, AsyncPipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  users: IUser[] = [
    { name: 'John Doe', uid: '1', avatar: 'JD', vote: 2 },
    { name: 'Janasdasdasdasde Doe', uid: '2', avatar: 'JD', vote: 2 },
    { name: 'John Smith', uid: '3', avatar: 'JS', vote: -1 },
    { name: 'Jane Smith', uid: '4', avatar: 'JS', vote: 2 },
    { name: 'Jane White', uid: '10', avatar: 'JW', vote: -1 },
  ];

  colors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'];


  constructor(public roomService: RoomService) {
    IconRegistry.define([tylIconCheckCircle, tylIconRadioButtonUnchecked]);
  }
  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }
}


