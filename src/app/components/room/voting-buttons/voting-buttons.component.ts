import { Component } from '@angular/core';
import { ForgeButtonModule, ForgeCardModule } from '@tylertech/forge-angular';
import { RoomService } from '../../../shared/services/room.service';
import { AsyncPipe } from '@angular/common';

const forgeModules = [ ForgeButtonModule, ForgeCardModule];

@Component({
  selector: 'app-voting-buttons',
  standalone: true,
  imports: [...forgeModules, AsyncPipe],
  templateUrl: './voting-buttons.component.html',
  styleUrl: './voting-buttons.component.scss'
})
export class VotingButtonsComponent {
  public votingOptions = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', 'pass'];

  public selectedIndex = -1;

  constructor(public roomService: RoomService) {}

  public onVoteClick(index: number): void {
    this.selectedIndex = index;
    console.log('Voted for', this.votingOptions[index]);
  }

  public onCallVoteClick(): void {
    this.roomService.closeVote();
  }

  public onopenVoteClick(): void {
    this.selectedIndex = -1;
    this.roomService.openVote();
  }
}
