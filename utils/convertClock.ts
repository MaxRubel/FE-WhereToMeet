export function convertClock(timeStr: string) {
  let [hours, minutes] = timeStr.split(":");

  let hoursF = parseInt(hours);

  const period = hoursF >= 12 ? "PM" : "AM";

  hoursF = hoursF % 12 || 12;

  return `${hoursF}:${minutes} ${period}`;
}
