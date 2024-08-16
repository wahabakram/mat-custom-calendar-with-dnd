import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarRecordComponent } from './calendar-record.component';

describe('CalendarRecordComponent', () => {
  let component: CalendarRecordComponent;
  let fixture: ComponentFixture<CalendarRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarRecordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
