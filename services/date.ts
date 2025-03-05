export function getStartAndEndDate(date: Date): StartAndEndDateInterface {
  return {
    dateStart: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
    dateEnd: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999),
  }
}

export function isDateBetween(date: Date, dateStart: Date, dateEnd: Date, strict: boolean = false): boolean {
  if(strict) {
    return dateStart < date && date < dateEnd;
  }
  else {
    return dateStart <= date && date <= dateEnd;
  }
}

export function getDateDifference(dateStart: Date, dateEnd: Date): number {
  return dateEnd.getTime() - dateStart.getTime();
}

export function isDateCurrentDay(date: Date): boolean {
  const { dateStart, dateEnd } = getStartAndEndDate(new Date());
  return isDateBetween(date, dateStart, dateEnd);
}

export function getFirstMonday(referenceDate: Date): Date {
  const firstDayOfCurrentMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const dayOfWeek = firstDayOfCurrentMonth.getDay();

  if (dayOfWeek === 1) { // Lundi
    return firstDayOfCurrentMonth;
  }
  else {
    const lastDayOfPreviousMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0);
    const offset = lastDayOfPreviousMonth.getDay() === 0 ? 6 : lastDayOfPreviousMonth.getDay() - 1;
    const lastMonday = new Date(lastDayOfPreviousMonth);

    lastMonday.setDate(lastDayOfPreviousMonth.getDate() - offset);

    return lastMonday;
  }
}

export function getLastSunday(referenceDate: Date): Date {
  const lastDayOfCurrentMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
  const dayOfWeek = lastDayOfCurrentMonth.getDay();

  if (dayOfWeek === 0) { // Dimanche
    return lastDayOfCurrentMonth;
  }
  else {
    const firstDayOfNextMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);
    const offset = firstDayOfNextMonth.getDay() === 0 ? 0 : 7 - firstDayOfNextMonth.getDay();
    const firstSunday = new Date(firstDayOfNextMonth);

    firstSunday.setDate(firstDayOfNextMonth.getDate() + offset);

    return firstSunday;
  }
}