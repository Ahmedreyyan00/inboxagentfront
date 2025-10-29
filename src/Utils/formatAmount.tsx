/**
 * Standardizes invoice amount formatting across the application
 * @param amount - The amount value (can be string or number)
 * @param currency - The currency code (defaults to 'USD')
 * @returns Formatted amount string with currency symbol and proper decimal places
 */
export function formatAmount(amount: string | number | null | undefined, currency: string = 'USD'): string {
  // Handle null, undefined, or empty values
  if (!amount && amount !== 0) {
    return getCurrencySymbol(currency) + '0.00';
  }

  // Convert to number, removing any non-numeric characters except decimal point and minus sign
  const numericAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^0-9.-]/g, '')) 
    : Number(amount);

  // Handle invalid numbers
  if (isNaN(numericAmount)) {
    return getCurrencySymbol(currency) + '0.00';
  }

  // Format to 2 decimal places
  const formattedAmount = numericAmount.toFixed(2);
  
  return getCurrencySymbol(currency) + formattedAmount;
}

/**
 * Gets the appropriate currency symbol for the given currency code
 * @param currency - The currency code
 * @returns Currency symbol
 */
function getCurrencySymbol(currency: string): string {
  const currencySymbols: { [key: string]: string } = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'CHF',
    'CNY': '¥',
    'SEK': 'kr',
    'NOK': 'kr',
    'DKK': 'kr',
    'PLN': 'zł',
    'CZK': 'Kč',
    'HUF': 'Ft',
    'RUB': '₽',
    'INR': '₹',
    'BRL': 'R$',
    'MXN': '$',
    'KRW': '₩',
    'SGD': 'S$',
    'HKD': 'HK$',
    'NZD': 'NZ$',
    'ZAR': 'R',
    'TRY': '₺',
    'ILS': '₪',
    'AED': 'د.إ',
    'SAR': '﷼',
    'QAR': '﷼',
    'KWD': 'د.ك',
    'BHD': 'د.ب',
    'OMR': '﷼',
    'JOD': 'د.ا',
    'LBP': 'ل.ل',
    'EGP': '£',
    'MAD': 'د.م.',
    'TND': 'د.ت',
    'DZD': 'د.ج',
    'LYD': 'ل.د',
    'ETB': 'Br',
    'KES': 'KSh',
    'UGX': 'USh',
    'TZS': 'TSh',
    'GHS': '₵',
    'NGN': '₦',
    'XOF': 'CFA',
    'XAF': 'FCFA',
    'MUR': '₨',
    'SCR': '₨',
    'MVR': 'ރ',
    'LKR': '₨',
    'BDT': '৳',
    'PKR': '₨',
    'AFN': '؋',
    'NPR': '₨',
    'BTN': 'Nu.',
    'MMK': 'K',
    'LAK': '₭',
    'KHR': '៛',
    'VND': '₫',
    'THB': '฿',
    'MYR': 'RM',
    'IDR': 'Rp',
    'PHP': '₱',
    'TWD': 'NT$',
    'MOP': 'MOP$',
    'BND': 'B$',
    'FJD': 'FJ$',
    'PGK': 'K',
    'SBD': 'SI$',
    'VUV': 'Vt',
    'WST': 'WS$',
    'TOP': 'T$',
    'XPF': '₣',
    'NIO': 'C$',
    'GTQ': 'Q',
    'HNL': 'L',
    'SVC': '$',
    'BZD': 'BZ$',
    'JMD': 'J$',
    'TTD': 'TT$',
    'BBD': 'Bds$',
    'XCD': '$',
    'AWG': 'ƒ',
    'BMD': '$',
    'KYD': '$',
    'GYD': 'G$',
    'SRD': '$',
    'UYU': '$U',
    'PYG': '₲',
    'BOB': 'Bs',
    'PEN': 'S/',
    'CLP': '$',
    'COP': '$',
    'VES': 'Bs.S',
    'ARS': '$',
    'FKP': '£',
    'GIP': '£',
    'ISK': 'kr',
    'RON': 'lei',
    'BGN': 'лв',
    'HRK': 'kn',
    'RSD': 'дин',
    'MKD': 'ден',
    'ALL': 'L',
    'BAM': 'КМ',
    'MDL': 'L',
    'UAH': '₴',
    'BYN': 'Br',
    'GEL': '₾',
    'AMD': '֏',
    'AZN': '₼',
    'KZT': '₸',
    'KGS': 'сом',
    'TJS': 'SM',
    'TMT': 'T',
    'UZS': 'лв',
    'MNT': '₮',
    'KPW': '₩'
  };

  return currencySymbols[currency.toUpperCase()] || currency.toUpperCase() + ' ';
}
