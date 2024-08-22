import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomContainerComponent } from './room-container/room-container.component';
import { RoomRoutingModule } from './room-routing.module';
import { VotingButtonsComponent } from './voting-buttons/voting-buttons.component';


@NgModule({
  declarations: [
    RoomContainerComponent,
    VotingButtonsComponent
  ],
  imports: [
    RoomRoutingModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoomModule { }
