import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { environment } from 'src/environments/environment';

interface Response {
  arrivalTimes: ArrivalTime[]
}

interface ArrivalTime {
  timestamp: number;
}

const OFFSET = 1000 * 60 * 15; // 15 minutes

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('chart') chart!: ElementRef;

  constructor(private readonly _http: HttpClient) {}

  ngAfterViewInit(): void {
    this._http.get<Response>(
      environment.endpoint
    ).subscribe((result) => {
      new Chart(
        this.chart.nativeElement,
        {
          type: 'line',
          data: {
            labels: result.arrivalTimes.map(row => new Date(row.timestamp).toDateString()),
            datasets: [
              {
                label: 'Arrival time per day',
                data: result.arrivalTimes.map(row => row.timestamp)
              }
            ]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day'
                }
              },
              y: {
                type: 'time',
                time: {
                  unit: 'hour',
                  displayFormats: {
                    hour: 'HH:mm',
                  },
                  tooltipFormat: 'HH:mm'
                },
                min: Math.min.apply(this, result.arrivalTimes.map(row => row.timestamp)) - OFFSET,
                max: Math.max.apply(this, result.arrivalTimes.map(row => row.timestamp)) + OFFSET,
              }
            }
          }
        }
      )
    });
  }
}