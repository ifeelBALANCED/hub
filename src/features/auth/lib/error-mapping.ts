export const mapAuthErrorToField = (error: Error): Record<string, string> => {
  const message = error.message.toLowerCase()
  const errorMap: Record<string, string> = {}

  if (message.includes('email')) {
    errorMap.email = error.message
  } else if (message.includes('password')) {
    errorMap.password = error.message
  } else if (message.includes('displayname') || message.includes('name')) {
    errorMap.displayName = error.message
  } else {
    errorMap.email = error.message
  }

  return errorMap
}

export const isAuthError = (error: unknown): error is Error => {
  return error instanceof Error
}
