import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';

export interface EventData {
  day: number;
  week: number;
  title?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private eventData: EventData = {
    day: 0,
    week: 0,
    title: '',
    description: '',
  };

  constructor() {}

  getDefaultDialogConfig(data?: EventData): MatDialogConfig<EventData> {
    return {
      width: '520px',
      data: data ?? this.eventData,
    };
  }
}
