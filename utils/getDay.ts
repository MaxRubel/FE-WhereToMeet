export function getDay(dateString: string) {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek];
}
