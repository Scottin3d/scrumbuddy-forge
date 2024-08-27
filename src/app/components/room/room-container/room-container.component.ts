import { Component, inject, OnInit } from '@angular/core';
import { VotingButtonsComponent } from '../voting-buttons/voting-buttons.component';
import { UserListComponent } from '../user-list/user-list.component';
import { ChartDisplayComponent } from '../chart-display/chart-display.component';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { IUser } from '../../../shared/models/IUser';
import { Auth } from '@angular/fire/auth';
import { RoomService } from '../../../shared/services/room.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-room-container',
  standalone: true,
  imports: [VotingButtonsComponent, UserListComponent, ChartDisplayComponent],
  templateUrl: './room-container.component.html',
  styleUrl: './room-container.component.scss'
})
export class RoomContainerComponent {
    private router = inject(Router);
    private roomService = inject(RoomService);

    constructor() { 
        this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
            if (event instanceof NavigationStart) {

                // if '/home' remove user from room
                if (event.url === '/home') {
                    this.roomService.LeaveRoom();
                }
            }
        });
    }


}
