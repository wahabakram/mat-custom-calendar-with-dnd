import { DAY_MILLISECONDS, DAYS_IN_WEEK } from '@constants';

// The algorithm just takes current date and returns a medium days range by week
export const getDates = (weeks: number) => {
  const today = Date.now();
  const dayOfTheWeek = new Date(today).getDay();
  const startWeekDiff = DAY_MILLISECONDS * dayOfTheWeek;
  const startTime = today - startWeekDiff - DAY_MILLISECONDS * DAYS_IN_WEEK * Math.floor(weeks / 2);
  const dates = [];
  for (let week = 0; week < weeks; week++) {
    const days = [];
    for (let day = 0; day < DAYS_IN_WEEK; day++) {
      const time = startTime + DAYS_IN_WEEK * week * DAY_MILLISECONDS + day * DAY_MILLISECONDS;
      days.push(new Date(time).getDate());
    }
    dates.push(days);
  }

  return dates;
};
