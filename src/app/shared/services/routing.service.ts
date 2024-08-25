import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  private router = inject(Router);

  constructor() { }

  public routeToHome() {
    this.router.navigate(['/home']);
  }

  public routeToRoomById(id: string) {
    this.router.navigate(['/room', id]);
  }
}
