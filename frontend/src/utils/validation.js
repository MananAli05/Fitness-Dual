import { NUMBER_FIELDS } from '../constants/profile.js'

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidUsername(username) {
  return /^[A-Za-z]{3,20}$/.test(username)
}

export function getNumberError(key, value) {
  const field = NUMBER_FIELDS[key]
  const number = Number(value)

  if (value === '' || value == null || Number.isNaN(number)) {
    return `Enter your ${field.label.toLowerCase()}`
  }
  if (number < field.min || number > field.max) {
    return `${field.label} must be between ${field.min} and ${field.max} ${field.unit}`
  }
  return null
}
