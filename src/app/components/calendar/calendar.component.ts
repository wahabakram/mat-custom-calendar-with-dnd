import { Component, inject } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { formatDate, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { getDates } from '@utils/dates';
import { pull, range } from '@utils/array';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DAY_MILLISECONDS, DAYS_IN_WEEK } from '@constants';
import { CalendarRecordComponent } from '@components/calendar-record/calendar-record.component';
import { CalendarHeaderComponent } from '@components/calendar-header/calendar-header.component';
import { CreateAppointmentDialogComponent } from '@components/create-appointment-dialog/create-appointment-dialog.component';
import { CalendarService, EventData } from '@services/calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgFor, DragDropModule, CalendarHeaderComponent, CalendarRecordComponent, MatCardModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  readonly dialog = inject(MatDialog);
  private _fb = inject(FormBuilder);
  private _calendarService = inject(CalendarService);

  private dialogRef!: MatDialogRef<CreateAppointmentDialogComponent, EventData>;
  private inputConfig: MatDialogConfig<EventData> = this._calendarService.getDefaultDialogConfig();

  today = new Date();
  tempDate = new Date();
  month = formatDate(this.today, 'MMMM yyyy', 'en-US');
  private monthOffset = 0;
  private events: { [date: string]: FormGroup[] } = {};

  dates = getDates(5);

  weeks = range(this.dates);
  days = range(DAYS_IN_WEEK);

  addEditRecord(day: number, week: number, selectedItemIdx?: number) {
    const date = this.getDate(week, day);
    this.inputConfig.data = {
      ...this.inputConfig.data,
      day: day,
      week: week,
      title: '',
      description: '',
    };

    if (this.haveSelectedItem(selectedItemIdx as number)) {
      this.inputConfig.data = {
        ...this.inputConfig.data,
        ...this.events[date][selectedItemIdx as number].value,
      };
    }

    this.dialogRef = this.dialog.open(CreateAppointmentDialogComponent, this.inputConfig);
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const tempFormGroup = this._fb.group({
          title: [result.title],
          description: [result.description],
        });

        if (!this.events[date]) {
          this.events[date] = [];
        }

        if (this.haveSelectedItem(selectedItemIdx as number)) {
          this.events[date][selectedItemIdx as number] = tempFormGroup;
        } else {
          this.events[date].push(tempFormGroup);
        }
      }
    });
  }

  getEvents(week: number, day: number): FormGroup[] {
    const date = this.getDate(week, day);
    return this.events[date] || [];
  }

  getDate(week: number, day: number): string {
    const date = new Date(this.tempDate);
    date.setDate(this.dates[week][day]);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  haveSelectedItem(index: number): boolean {
    return index !== undefined && index > -1;
  }

  deleteRecord(day: number, week: number, control: FormGroup) {
    const date = this.getDate(week, day);
    pull(this.events[date], control);
  }

  dropItem(event: CdkDragDrop<FormGroup[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const [week, day] = event.container.id.split(',');
      const date = this.getDate(parseInt(week, 10), parseInt(day, 10));
      const previousDate = this.getDate(
        parseInt(event.previousContainer.id.split(',')[0], 10),
        parseInt(event.previousContainer.id.split(',')[1], 10)
      );
      const item = event.previousContainer.data.splice(event.previousIndex, 1)[0];
      if (!this.events[date]) {
        this.events[date] = [];
      }
      this.events[date].splice(event.currentIndex, 0, item);
      if (this.events[previousDate].length === 0) {
        delete this.events[previousDate];
      }
    }
  }

  monthChange(option: string) {
    if (option === 'previous') {
      this.monthOffset--;
    } else if (option === 'next') {
      this.monthOffset++;
    }

    const weeks = this.dates.length;
    const date = new Date(this.today);
    date.setMonth(date.getMonth() + this.monthOffset);
    date.setDate(1); // Set the date to the first day of the month
    const dayOfTheWeek = date.getDay();
    const startWeekDiff = DAY_MILLISECONDS * dayOfTheWeek;
    const startTime = date.getTime() - startWeekDiff;

    const newDates = [];
    for (let week = 0; week < weeks; week++) {
      const days = [];
      for (let day = 0; day < DAYS_IN_WEEK; day++) {
        const time = startTime + DAYS_IN_WEEK * week * DAY_MILLISECONDS + day * DAY_MILLISECONDS;
        days.push(new Date(time).getDate());
      }
      newDates.push(days);
    }

    this.dates = newDates;
    // Update the month name
    this.month = formatDate(date, 'MMMM yyyy', 'en-US');
    this.updateTempDate(date.getFullYear(), date.getMonth());
  }

  private updateTempDate(year: number, month: number) {
    this.tempDate = new Date(year, month, 1);
  }
}
