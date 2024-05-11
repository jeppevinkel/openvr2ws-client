export async function toSha256(text: string): Promise<string> {
    const textBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', textBuffer);
    const bytes = Array.from(new Uint8Array(hashBuffer));
    return btoa(String.fromCharCode(...bytes));
}