// Helper to parse PDF date string and format as dd/mm/yyyy and hh:mm
export function formatPdfDate(dateStr: string): string {
  // PDF date format: D:YYYYMMDDHHmmSSOHH'mm'
  // Example: D:20230702153000Z
  if (!dateStr || typeof dateStr !== 'string') return dateStr;
  const match = dateStr.match(/^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})?/);
  if (!match) return dateStr;
  const [, year, month, day, hour = '00', min = '00'] = match;
  return `${day}/${month}/${year} ${hour}:${min}`;
} 