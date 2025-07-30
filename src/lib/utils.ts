import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDateTime(date: Date | string) {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat("en-US").format(number)
}

export function formatPercentage(number: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(number / 100)
}

export function formatFileSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"]
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function parseJSON<T>(json: string): T | null {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return null
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
