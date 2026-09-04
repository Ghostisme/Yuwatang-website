/** 需求2-19：反馈合规校验 — 禁止医疗功效表述 */
const BLOCKED_PATTERNS = [/治好/, /治愈/, /疗效/, /痊愈/, /根治/, /包治/]

export function hasMedicalClaim(text: string): boolean {
  return BLOCKED_PATTERNS.some((re) => re.test(text))
}

export function sanitizeReviewDisplay(text: string): string {
  let out = text
  for (const re of BLOCKED_PATTERNS) {
    out = out.replace(re, "***")
  }
  return out
}
