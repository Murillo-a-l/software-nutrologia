/**
 * Calcula a idade a partir de uma data de nascimento
 */
export function calculateAge(birthDate: Date, referenceDate: Date = new Date()): number {
  const age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  const dayDiff = referenceDate.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return age - 1;
  }

  return age;
}

/**
 * Formata uma data para o formato brasileiro DD/MM/YYYY
 */
export function formatDateToBrazilian(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Retorna a data e hora atual formatada
 */
export function getCurrentDateTime(): string {
  const now = new Date();
  return `${formatDateToBrazilian(now)} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
}
