import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-calendar-record',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './calendar-record.component.html',
  styleUrl: './calendar-record.component.scss',
})
export class CalendarRecordComponent {
  @Input() control?: FormGroup;
  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
}
