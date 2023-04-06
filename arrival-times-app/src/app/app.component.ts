import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { environment } from 'src/environments/environment';

interface Response {
  arrivalTimes: string[]
}

interface ArrivalTime {
  day: Date;
  hour: Date;
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
      const data = this._prepareData(result);
      new Chart(
        this.chart.nativeElement,
        {
          type: 'line',
          data: {
            labels: data.map(arrivalTime => arrivalTime.day),
            datasets: [
              {
                label: 'Arrival time per day',
                data: data.map(arrivalTime => arrivalTime.hour)
              }
            ]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                  tooltipFormat: 'MMM D'
                }
              },
              y: {
                type: 'time',
                time: {
                  unit: 'minute',
                  displayFormats: {
                    hour: 'HH:mm',
                  },
                  tooltipFormat: 'HH:mm',
                },
                min: Math.min(...data.map(arrivalTime => arrivalTime.hour.getTime())) - OFFSET,
                max: Math.max(...data.map(arrivalTime => arrivalTime.hour.getTime())) + OFFSET,
              }
            }
          }
        }
      )
    });
  }

  private _prepareData(response: Response): ArrivalTime[] {
    return response.arrivalTimes.map(rawDate => {
      const date = new Date(rawDate);

      return {
        day: this._getDay(date),
        hour: this._getTimeOfDay(date)
      };
    });
  }

  private _getDay(baseDate: Date): Date {
    const date = new Date(baseDate);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  
    return date;
  }

  private _getTimeOfDay(baseDate: Date): Date {
    const date = new Date(baseDate);
    date.setFullYear(0);
    date.setMonth(0);
    date.setDate(0);
  
    return date;
  }
}
