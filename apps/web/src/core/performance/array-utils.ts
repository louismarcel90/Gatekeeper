export function stableSortByString<T>(items: T[], selector: (item: T) => string): T[] {
  return [...items].sort((a, b) => selector(a).localeCompare(selector(b)));
}

export function stableSortByNumber<T>(items: T[], selector: (item: T) => number): T[] {
  return [...items].sort((a, b) => selector(a) - selector(b));
}

export function paginateItems<T>(params: { items: T[]; page: number; pageSize: number }): T[] {
  return params.items.slice(params.page * params.pageSize, (params.page + 1) * params.pageSize);
}

export function includesNormalized(value: string, needle: string): boolean {
  return value.toLowerCase().includes(needle.trim().toLowerCase());
}
