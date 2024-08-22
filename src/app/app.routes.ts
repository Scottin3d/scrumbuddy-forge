import { Routes } from '@angular/router';
import { HomeComponent } from './components/shared/home/home.component';
import { RoomContainerComponent } from './components/room/room-container/room-container.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'room/:id', component: RoomContainerComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];
