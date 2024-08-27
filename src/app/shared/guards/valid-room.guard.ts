import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RoomService } from '../services/room.service';
import { RoutingService } from '../services/routing.service';
import { from, switchMap, of } from 'rxjs';

export const validRoomGuard: CanActivateFn = (route, state) => {
  const roomService = inject(RoomService);
  const routingService = inject(RoutingService);

  return from(roomService.validateRoomCode(route.params['id'])).pipe(
    switchMap((exists) => {
        if (exists) {
            return of(true);
        } else {
            routingService.routeToHome();
            return of(false);
        }
    }
    ));
};
