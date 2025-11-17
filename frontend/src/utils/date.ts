/**
 * Calcula a idade a partir de uma data de nascimento no formato DD/MM/YYYY
 */
export function calculateAge(birthDate: string): number {
  const [day, month, year] = birthDate.split('/').map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Formata uma data ISO para DD/MM/YYYY
 */
export function formatDateToBrazilian(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Retorna a data atual no formato DD/MM/YYYY
 */
export function getCurrentDateBrazilian(): string {
  return formatDateToBrazilian(new Date());
}

/**
 * Valida uma data no formato DD/MM/YYYY
 */
export function isValidBrazilianDate(dateStr: string): boolean {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return false;

  const [day, month, year] = parts.map(Number);

  if (!day || !month || !year) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;

  return true;
}
