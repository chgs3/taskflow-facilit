export function formatDate(date: string | null) {
  if (!date) {
    return 'Sem data limite';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(date));
}

export function toDateTimeLocalValue(date: string | null) {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);
  const timezoneOffset = parsedDate.getTimezoneOffset() * 60000;
  const localDate = new Date(parsedDate.getTime() - timezoneOffset);

  return localDate.toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}