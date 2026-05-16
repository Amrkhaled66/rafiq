export function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

