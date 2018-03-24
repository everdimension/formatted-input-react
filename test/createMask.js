function unformat(numberString) {
  return numberString.replace(/([^\d.-]|\.(?=.*\.)|^\.|(?!^)-)/g, '');
}

export function createMask(inputValue = '') {
  const cleared = unformat(inputValue);
  if (cleared === '-' || cleared === '-0' || cleared === '-0.') {
    return cleared.split('').map(l => (/\d/.test(l) ? /\d/ : l));
  }
  const number = Number(cleared);
  if (isNaN(number)) {
    return [/\d/];
  }
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 20,
  }).format(number);
  const mask = formatted.split('').map(l => (/\d/.test(l) ? /\d/ : l));
  if (cleared.endsWith('.')) {
    mask.push('.');
  }

  return mask;
}
