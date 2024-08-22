import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomContainerComponent } from './room-container/room-container.component';

const routes: Routes = [
    { path: ':id', component: RoomContainerComponent },
    { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoomRoutingModule { }
