import { Component, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { RoomService } from '../../../shared/services/room.service';
import { ChartDisplayComponent } from '../chart-display/chart-display.component';
import { UserListComponent } from '../user-list/user-list.component';
import { VotingButtonsComponent } from '../voting-buttons/voting-buttons.component';

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
            // switch (true) {
                // case event instanceof NavigationStart:
            if (event instanceof NavigationStart) {
                if (event.url === '/home') {
                    this.roomService.LeaveRoom();
                }
            }else if(event instanceof NavigationEnd){
                this.roomService.openVote();
            }
        });
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event) {
        this.roomService.LeaveRoom();
    }
}
