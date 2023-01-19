export const formatDate = (date) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const formatMonth = m > 9 ? m : `0${m}`;
  return `${y}/${formatMonth}/${d}`;
}
