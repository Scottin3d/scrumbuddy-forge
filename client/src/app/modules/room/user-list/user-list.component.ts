import { Component } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
    public users: IUser[] = [
        {name: 'John Doe', uid: '1', avatar: 'JD'},
        {name: 'Jane Doe', uid: '2', avatar: 'JD'},
        {name: 'John Smith', uid: '3', avatar: 'JS'},
        {name: 'Jane Smith', uid: '4', avatar: 'JS'},
        {name: 'John Johnson', uid: '5', avatar: 'JJ'},
        {name: 'Jane Johnson', uid: '6', avatar: 'JJ'},
    ];
}

export interface IUser{
    name: string;
    uid: string;
    avatar: string;
}
