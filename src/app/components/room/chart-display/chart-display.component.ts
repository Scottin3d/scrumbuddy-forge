import { Component, inject, OnInit } from '@angular/core';
import { ForgeCardModule } from '@tylertech/forge-angular';
import { ApexLegend, ApexStroke, ApexTooltip, ApexYAxis, NgApexchartsModule } from "ng-apexcharts";

import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexTitleSubtitle,
    ApexFill,
    ApexDataLabels,
} from 'ng-apexcharts';
import { RoomService } from '../../../shared/services/room.service';
import { BehaviorSubject, shareReplay } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';


const forgeModules = [ForgeCardModule];

@Component({
    selector: 'app-chart-display',
    standalone: true,
    imports: [...forgeModules, NgApexchartsModule, AsyncPipe],
    templateUrl: './chart-display.component.html',
    styleUrl: './chart-display.component.scss'
})
export class ChartDisplayComponent {
    // dependency injection
    public roomService = inject(RoomService);
    public score: BehaviorSubject<string> = new BehaviorSubject<string>('Tie');

    public votingOptions = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', 'pass'];

    public title: ApexTitleSubtitle = {
        text: 'Basic Line Chart'
    };
    public series: ApexAxisChartSeries = [
        {
            name: 'Votes',
            type: 'bar',
            data: []
        },
        {
            type: 'line',
            data: []
        }
    ];
    public chart: ApexChart = {
        type: 'line',
        height: 350
    };

    public xAxis: ApexXAxis = {
        categories: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89'],
    };

    public yAxis: ApexYAxis = {
        stepSize: 1,
        min: 0,
        max: 10,
        title: {
            text: 'Votes'
        }
    };

    public stroke: ApexStroke = {
        width: [0, 3, 5],
        curve: 'smooth'
    };

    public dataLabels: ApexDataLabels = {
        enabled: false
    };

    public legend: ApexLegend = {
        show: false
    };

    public toolTip: ApexTooltip = {
        enabled: false
    };

    constructor() {
        this.roomService.votes$.pipe(takeUntilDestroyed()).subscribe((votes) => {
            // strip the first element of votes
            votes.shift();
            this.series = [
                {
                    name: 'Votes',
                    type: 'bar',
                    data: votes
                },
                {
                    type: 'line',
                    data: votes
                }
            ];

            // score is the value where the index of the max votes
            const max = Math.max(...votes);
            // check if there is a tie
            const tie = votes.filter((vote) => vote === max).length > 1;

            const maxIndex = votes.indexOf(max);
            const score = this.votingOptions[maxIndex];
            this.score.next(tie ? 'Tie' : score);


        });

        this.roomService.users$.pipe(takeUntilDestroyed()).subscribe((users) => {
            // set the value to user count or min of 5 whichever is greater
            this.yAxis.max = users.length < 5 ? 5 : users.length;
        });
    }
}
