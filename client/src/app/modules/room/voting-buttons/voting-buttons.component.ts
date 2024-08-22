import { Component } from '@angular/core';

@Component({
  selector: 'app-voting-buttons',
  templateUrl: './voting-buttons.component.html',
  styleUrl: './voting-buttons.component.scss'
})
export class VotingButtonsComponent {
    public votingOptions = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', 'pass'];

    public onClick(index: number): void {
        console.log('Voted:', this.votingOptions[index]);
    }
}
