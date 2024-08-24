import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  public isVoteOpen: Observable<boolean> = of(true);


  constructor() { }

  public openVote(): void {
    this.isVoteOpen = of(true);
  }

  public closeVote(): void {
    this.isVoteOpen = of(false);
  }
}
