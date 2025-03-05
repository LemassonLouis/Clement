/**
 * Return the start date and end date from a date.
 * @param date Reference date.
 * @returns Object of dates
 */
export function getStartAndEndDate(date: Date): StartAndEndDateInterface {
  return {
    dateStart: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
    dateEnd: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999),
  }
}

/**
 * Is date between 2 others.
 * @param date Reference date.
 * @param dateStart Start date reference.
 * @param dateEnd End date reference.
 * @param strict `< and >` or `<= and >=`, default : `false`
 * @returns 
 */
export function isDateBetween(date: Date, dateStart: Date, dateEnd: Date, strict: boolean = false): boolean {
  dateStartEndValidation(dateStart, dateEnd);

  if(strict) {
    return dateStart < date && date < dateEnd;
  }
  else {
    return dateStart <= date && date <= dateEnd;
  }
}

/**
 * Get the difference between two dates (in miliseconds).
 * @param dateStart Start date reference.
 * @param dateEnd End date reference.
 * @returns 
 */
export function getDateDifference(dateStart: Date, dateEnd: Date): number {
  dateStartEndValidation(dateStart, dateEnd);

  return dateEnd.getTime() - dateStart.getTime();
}

/**
 * Is the date current day.
 * @param date Date reference.
 * @returns 
 */
export function isDateCurrentDay(date: Date): boolean {
  const { dateStart, dateEnd } = getStartAndEndDate(new Date());

  return isDateBetween(date, dateStart, dateEnd);
}

/**
 * Get the first calendar monday of the date month.
 * @param date Date reference.
 * @returns 
 */
export function getCalendarStartMonday(date: Date): Date {
  const firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfCurrentMonth.getDay();

  if (dayOfWeek === 1) { // Lundi
    return firstDayOfCurrentMonth;
  }
  else {
    const lastDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    const offset = lastDayOfPreviousMonth.getDay() === 0 ? 6 : lastDayOfPreviousMonth.getDay() - 1;
    const lastMonday = new Date(lastDayOfPreviousMonth);

    lastMonday.setDate(lastDayOfPreviousMonth.getDate() - offset);

    return lastMonday;
  }
}

/**
 * Get the last calendar sunday of the date month.
 * @param date Date reference.
 * @returns 
 */
export function getCalendarLastSunday(date: Date): Date {
  const lastDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const dayOfWeek = lastDayOfCurrentMonth.getDay();

  if (dayOfWeek === 0) { // Dimanche
    return lastDayOfCurrentMonth;
  }
  else {
    const firstDayOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const offset = firstDayOfNextMonth.getDay() === 0 ? 0 : 7 - firstDayOfNextMonth.getDay();
    const firstSunday = new Date(firstDayOfNextMonth);

    firstSunday.setDate(firstDayOfNextMonth.getDate() + offset);

    return firstSunday;
  }
}


/**
 * Validate or thow if start date is greater or equal than end date.
 * @param dateStart Start date reference.
 * @param dateEnd End date reference.
 */
function dateStartEndValidation(dateStart: Date, dateEnd: Date): void {
  if(dateStart >= dateEnd) {
    throw new Error("The start date can't be greater or equal than the end date.");
  }
}