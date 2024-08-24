import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { ForgeButtonModule, ForgeCardModule, ForgeIconModule } from '@tylertech/forge-angular';
import { IconRegistry } from '@tylertech/forge';
import { tylIconCheckCircle, tylIconRadioButtonUnchecked } from '@tylertech/tyler-icons/standard';
const forgeModules = [ ForgeButtonModule, ForgeCardModule, ForgeIconModule];


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [...forgeModules, NgStyle],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  users: IUser[] = [
    { name: 'John Doe', uid: '1', avatar: 'JD', hasVoted: true },
    { name: 'Janasdasdasdasde Doe', uid: '2', avatar: 'JD', hasVoted: true },
    { name: 'John Smith', uid: '3', avatar: 'JS', hasVoted: false },
    { name: 'Jane Smith', uid: '4', avatar: 'JS', hasVoted: true },
    { name: 'Jane White', uid: '10', avatar: 'JW', hasVoted: false },
  ];

  colors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'];


  constructor() {
    IconRegistry.define([tylIconCheckCircle, tylIconRadioButtonUnchecked]);
  }
  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }
}

export interface IUser {
  name: string;
  uid: string;
  avatar: string;
  hasVoted: boolean;

}
