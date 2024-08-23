import { Component } from '@angular/core';
import { VotingButtonsComponent } from '../voting-buttons/voting-buttons.component';
import { UserListComponent } from '../user-list/user-list.component';
import { ChartDisplayComponent } from '../chart-display/chart-display.component';

@Component({
  selector: 'app-room-container',
  standalone: true,
  imports: [VotingButtonsComponent, UserListComponent, ChartDisplayComponent],
  templateUrl: './room-container.component.html',
  styleUrl: './room-container.component.scss'
})
export class RoomContainerComponent {

}
