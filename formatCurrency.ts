export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm"
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('uz', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('uz', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Kutilmoqda',
    preparing: 'Tayyorlanmoqda',
    ready: 'Tayyor',
    completed: 'Yakunlandi',
    cancelled: 'Bekor qilindi',
  }
  return labels[status] ?? status
}

export function getOrderTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'dine-in': 'Stol',
    takeaway: 'Olib ketish',
    delivery: 'Dostavka',
  }
  return labels[type] ?? type
}
