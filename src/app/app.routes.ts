import { Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { RoomContainerComponent } from './components/room/room-container/room-container.component';
import { validRoomGuard } from './shared/guards/valid-room.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'room/:id', component: RoomContainerComponent, canActivate: [validRoomGuard] },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];
