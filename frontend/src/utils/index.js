export const cx = (...classes) => classes.filter(Boolean).join(' ');
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const formatNumber = (n) => new Intl.NumberFormat().format(n);
