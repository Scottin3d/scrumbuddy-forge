import { Component } from '@angular/core';
import { ForgeButtonModule, ForgeCardModule } from '@tylertech/forge-angular';

const forgeModules = [ ForgeButtonModule, ForgeCardModule];

@Component({
  selector: 'app-voting-buttons',
  standalone: true,
  imports: [...forgeModules],
  templateUrl: './voting-buttons.component.html',
  styleUrl: './voting-buttons.component.scss'
})
export class VotingButtonsComponent {
  public votingOptions = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', 'pass'];

  public selectedIndex = -1;

  public onVoteClick(index: number): void {
    this.selectedIndex = index;
    console.log('Voted for', this.votingOptions[index]);
  }
}
