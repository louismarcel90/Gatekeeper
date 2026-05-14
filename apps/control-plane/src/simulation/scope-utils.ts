export function findMissingScopes(requiredScopes: string[], grantedScopes: string[]): string[] {
  const grantedSet = new Set(grantedScopes);
  return requiredScopes.filter((scope) => !grantedSet.has(scope));
}
