// ===========================================
// FORMATTING UTILITIES
// ===========================================

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\+31)(\s?)(\d)(\s?)(\d{4})(\s?)(\d{4})/, "$1 $3 $5 $7")
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DKM-${timestamp}-${random}`
}

export function generateVoucherCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = "DKM-"
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
