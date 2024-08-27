import { Component, inject } from '@angular/core';
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  ForgeAppBarMenuButtonModule,
  ForgeIconButtonModule,
  ForgeAppBarModule,
  ForgeAppBarProfileButtonModule,
  ForgeButtonModule,
  ForgeIconModule,
  ForgeScaffoldModule,
  ForgeToolbarModule,
} from '@tylertech/forge-angular';
import { RoomService } from './shared/services/room.service';
import { RoutingService } from './shared/services/routing.service';

const forgeModules = [
  ForgeButtonModule,
  ForgeScaffoldModule,
  ForgeAppBarModule,
  ForgeToolbarModule,
  ForgeAppBarMenuButtonModule,
  ForgeAppBarProfileButtonModule,
  ForgeIconModule,
  ForgeIconButtonModule,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ...forgeModules],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private auth = inject(Auth);
  private routingService = inject(RoutingService);
  title = 'scrumbuddy-forge';

  constructor() {
    signInAnonymously(this.auth);

    this.auth.onAuthStateChanged((user) => console.log(user));
  }

  public onLogoClick(): void {
    this.routingService.routeToHome();
  }
}
