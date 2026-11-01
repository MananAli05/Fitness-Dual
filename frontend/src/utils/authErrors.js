export function getAuthErrorMessage(error) {
  const message = error?.message ?? ''

  if (/invalid login credentials/i.test(message)) return 'Wrong password for this email.'
  if (/email not confirmed/i.test(message)) return 'Please confirm your email first — check your inbox.'
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Please wait a minute and try again.'
  if (/could not find the function/i.test(message)) return 'Database setup is incomplete (run migration 002).'

  return message || 'Something went wrong. Please try again.'
}
