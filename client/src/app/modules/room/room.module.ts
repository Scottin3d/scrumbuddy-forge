import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomContainerComponent } from './room-container/room-container.component';
import { RoomRoutingModule } from './room-routing.module';
import { VotingButtonsComponent } from './voting-buttons/voting-buttons.component';
import { ChartDisplayComponent } from './chart-display/chart-display.component';
import { UserListComponent } from './user-list/user-list.component';


@NgModule({
  declarations: [
    RoomContainerComponent,
    VotingButtonsComponent,
    ChartDisplayComponent,
    UserListComponent
  ],
  imports: [
    RoomRoutingModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoomModule { }
