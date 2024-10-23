export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[month]} ${day}, ${year}`;
}
