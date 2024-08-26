import { Component } from '@angular/core';
import { ForgeCardModule } from '@tylertech/forge-angular';
import { ApexYAxis, NgApexchartsModule } from "ng-apexcharts";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexFill,
  ApexDataLabels,
} from 'ng-apexcharts';


const forgeModules = [ForgeCardModule];

@Component({
  selector: 'app-chart-display',
  standalone: true,
  imports: [...forgeModules, NgApexchartsModule],
  templateUrl: './chart-display.component.html',
  styleUrl: './chart-display.component.scss'
})
export class ChartDisplayComponent {
  public votingOptions = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', 'pass'];

  public title: ApexTitleSubtitle = {
    text: 'Basic Line Chart'
  };
  public series: ApexAxisChartSeries  = [
    {
      data: [0,1,2,5,0,0,0,0,0,0]
    }
  ];
  public chart: ApexChart = {
    type: 'bar',
    height: 350
  };

  public xAxis: ApexXAxis = {
    categories: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89'],
  };

  public yAxis: ApexYAxis = {
    stepSize: 1,
    title: {
      text: 'Votes'
    }
  };
}
