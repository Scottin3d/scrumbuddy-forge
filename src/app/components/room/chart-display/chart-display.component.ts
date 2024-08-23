import { Component } from '@angular/core';
import { ForgeCardModule } from '@tylertech/forge-angular';

const forgeModules = [ForgeCardModule];

@Component({
  selector: 'app-chart-display',
  standalone: true,
  imports: [...forgeModules],
  templateUrl: './chart-display.component.html',
  styleUrl: './chart-display.component.scss'
})
export class ChartDisplayComponent {

}
