const options = { year: 'numeric', month: 'long', day: 'numeric' };

export function dateToDateString(date: Date) {
  return date.toLocaleDateString("en-US", options);
}