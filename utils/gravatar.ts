export async function getGravatarUrl(identifier: string, size = 80): Promise<string> {
  const normalized = identifier.trim().toLowerCase()
  const bytes = new TextEncoder().encode(normalized)
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes)
  const hex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `https://gravatar.com/avatar/${hex}?s=${size}&d=identicon`
}
