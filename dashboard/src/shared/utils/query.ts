export function optionalTrim(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

