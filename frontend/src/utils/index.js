export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
}
