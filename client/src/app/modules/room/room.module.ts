import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomContainerComponent } from './room-container/room-container.component';
import { RoomRoutingModule } from './room-routing.module';



@NgModule({
  declarations: [
    RoomContainerComponent
  ],
  imports: [
    RoomRoutingModule,
    CommonModule
  ]
})
export class RoomModule { }
