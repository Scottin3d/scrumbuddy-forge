import { Component, inject } from '@angular/core';
import { ForgeButtonModule, ForgeCardModule } from '@tylertech/forge-angular';
import { RoomService } from '../../../shared/services/room.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const forgeModules = [ForgeButtonModule, ForgeCardModule];

@Component({
    selector: 'app-voting-buttons',
    standalone: true,
    imports: [...forgeModules, AsyncPipe, NgIf],
    templateUrl: './voting-buttons.component.html',
    styleUrl: './voting-buttons.component.scss'
})
export class VotingButtonsComponent {
    public roomService = inject(RoomService);

    public votingOptions = ['pass', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89'];

    public selectedIndex = -1;

    constructor() {
        // if roomService.room$.value.isVoteOpen changes from false to true, then set selectedIndex to 0
        this.roomService.room$.pipe(takeUntilDestroyed()).subscribe((room) => {
            if (room.isVoteOpen) {
                this.selectedIndex = 0;
            }
        });
    }

    public onVoteClick(index: number): void {
        this.selectedIndex = index;
        this.roomService.vote(index);
    }

    public onCallVoteClick(): void {
        this.roomService.closeVote();
    }

    public onopenVoteClick(): void {
        this.selectedIndex = 0;
        this.roomService.openVote();
    }
}
