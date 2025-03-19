import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Deep comparison of two values
 * @param obj1 First object to compare
 * @param obj2 Second object to compare
 * @returns true if the objects are deeply equal
 */
export function deepEqual(obj1: unknown, obj2: unknown): boolean {
  // Handle primitive types and null/undefined
  if (obj1 === obj2) return true
  if (obj1 == null || obj2 == null) return false
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false

  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false
    return obj1.every((val, index) => deepEqual(val, obj2[index]))
  }

  // If one is array but the other is not, they're not equal
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false

  // Both are objects, compare their keys and values
  const keys1 = Object.keys(obj1 as object)
  const keys2 = Object.keys(obj2 as object)

  if (keys1.length !== keys2.length) return false

  return keys1.every((key) => {
    return (
      Object.prototype.hasOwnProperty.call(obj2, key) &&
      deepEqual(
        (obj1 as Record<string, unknown>)[key],
        (obj2 as Record<string, unknown>)[key]
      )
    )
  })
}
