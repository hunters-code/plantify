export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  decimals: number = 2,
): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(amount);
}

export function formatNumber(number: number, decimals: number = 0): string {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}
