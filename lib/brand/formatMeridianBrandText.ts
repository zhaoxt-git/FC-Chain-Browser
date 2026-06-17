export function formatMeridianBrandText(value: string): string {
  if (value === 'MER' || value === 'FCC' || value === 'FC') {
    return 'MRD';
  }

  return value
    .replace(/\bFC Chain\b/gi, 'Meridian')
    .replace(/\bFCChain\b/g, 'Meridian')
    .replace(/\bFuture Citizen Chain\b/gi, 'Meridian')
    .replace(/\bFC (?:Coin|Token)\b/gi, 'Meridian Token')
    .replace(/\bMER\b/g, 'MRD')
    .replace(/\bFCC\b/g, 'MRD')
    .replace(/\bfc\b/gi, 'Meridian');
}
