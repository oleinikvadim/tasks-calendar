import { Component } from '@angular/core';
import { DateService } from 'src/app/shared/date.service';
import * as moment from 'moment';

interface Day {
  value: moment.Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
}

interface Week {
  days: Day[]
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  calendar!: Week[];
  constructor(
    private dateService: DateService
  ) { }


  ngOnInit() {
    this.dateService.date.subscribe(this.generate.bind(this));
  }

  generate(now: moment.Moment): void {
    const startDate = now.clone().startOf('month').startOf('week');
    const endDate = now.clone().endOf('month').endOf('week');
    const date = startDate.clone().subtract(1, 'day');

    const calendar = [];
    while (date.isBefore(endDate, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !now.isSame(value, 'month');
            const selected = now.isSame(value, 'date');
            return {
              value, active, disabled, selected
            };
          })
      });
    }

    this.calendar = calendar;
  }

  selected(day: moment.Moment): void {
    this.dateService.changeDate(day);
  }
}
