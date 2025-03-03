export function getStartAndEndDate(date: Date): StartAndEndDateInterface {
  return {
    dateStart: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
    dateEnd: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999),
  }
}

export function dateIsBetween(date: Date, dateStart: Date, dateEnd: Date, strict: boolean = false): boolean {
  if(strict) {
    return dateStart < date && date < dateEnd;
  }
  else {
    return dateStart <= date && date <= dateEnd;
  }
}

export function getDifference(dateStart: Date, dateEnd: Date): number {
  return dateEnd.getTime() - dateStart.getTime();
}

export function isCurrentDay(date: Date): boolean {
  const { dateStart, dateEnd } = getStartAndEndDate(new Date());
  return dateIsBetween(date, dateStart, dateEnd);
}