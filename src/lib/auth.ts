import crypto from "crypto";

const SECRET_KEY =
  process.env.DOWNLOAD_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "sage-secure-vault-secret-key-salt-2026-production";

/**
 * Generates a signed, time-limited token for authorized file download.
 * Token format: Base64Url(id:expiresAt:signature)
 */
export function generateDownloadToken(itemId: string, durationMinutes = 15): string {
  const expiresAt = Date.now() + durationMinutes * 60 * 1000;
  const payload = `${itemId}:${expiresAt}`;
  const hmac = crypto.createHmac("sha256", SECRET_KEY).update(payload).digest("hex");
  const rawToken = `${payload}:${hmac}`;
  return Buffer.from(rawToken, "utf8").toString("base64url");
}

/**
 * Validates a download token. Returns the itemId if valid, or null if expired/tampered.
 */
export function verifyDownloadToken(token: string): { valid: boolean; itemId?: string; error?: string } {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [itemId, expiresAtStr, signature] = decoded.split(":");

    if (!itemId || !expiresAtStr || !signature) {
      return { valid: false, error: "Malformed token" };
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return { valid: false, error: "Download link has expired. Please re-enter passcode." };
    }

    const payload = `${itemId}:${expiresAtStr}`;
    const expectedSignature = crypto.createHmac("sha256", SECRET_KEY).update(payload).digest("hex");

    // Constant-time comparison
    const sigBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false, error: "Invalid token signature" };
    }

    return { valid: true, itemId };
  } catch {
    return { valid: false, error: "Token verification failed" };
  }
}

/**
 * Securely compares user-provided passcode with expected passcode.
 */
export function verifyPasscode(inputPass: string, expectedPass: string): boolean {
  if (!inputPass || !expectedPass) return false;

  const normalizedInput = inputPass.trim();
  const normalizedExpected = expectedPass.trim();

  // If password in config is stored as SHA-256 hash
  if (normalizedExpected.length === 64 && /^[0-9a-fA-F]+$/.test(normalizedExpected)) {
    const hashedInput = crypto.createHash("sha256").update(normalizedInput).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(hashedInput), Buffer.from(normalizedExpected.toLowerCase()));
  }

  // Plain-text matching with timing safety
  const inputBuf = Buffer.from(normalizedInput);
  const expectedBuf = Buffer.from(normalizedExpected);

  if (inputBuf.length !== expectedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuf, expectedBuf);
}
