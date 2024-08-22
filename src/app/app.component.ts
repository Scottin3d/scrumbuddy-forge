import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ForgeAppBarMenuButtonModule, ForgeAppBarModule, ForgeAppBarProfileButtonModule, ForgeButtonModule, ForgeIconModule, ForgeScaffoldModule, ForgeToolbarModule } from '@tylertech/forge-angular';

const forgeModules = [
    ForgeButtonModule,
    ForgeScaffoldModule,
    ForgeAppBarModule,
    ForgeToolbarModule,
    ForgeAppBarMenuButtonModule,
    ForgeAppBarProfileButtonModule,
    ForgeIconModule
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ...forgeModules],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'scrumbuddy-forge';
}
