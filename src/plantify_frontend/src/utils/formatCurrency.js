export function formatCurrency(amount, currency = 'USD', decimals = 2) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(amount);
}

export function formatNumber(number, decimals = 0) {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}
