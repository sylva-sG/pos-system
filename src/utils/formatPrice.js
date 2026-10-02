const USD_TO_KSH = 130;

export const toKsh = (usd) => Math.round(usd * USD_TO_KSH);

export const formatKsh = (ksh) => `KSh ${ksh.toLocaleString("en-KE")}`;

export const formatPrice = (usd) => formatKsh(toKsh(usd));