import { Component } from '@angular/core';
import { ForgeButtonModule, ForgeCardModule } from '@tylertech/forge-angular';


const forgeModules = [ ForgeButtonModule, ForgeCardModule];


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [...forgeModules],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

}
