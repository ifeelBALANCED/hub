export const VALIDATION = {
  EMAIL: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 256,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 64,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  VERIFICATION_CODE: {
    LENGTH: 6,
  },
} as const

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email',
  EMAIL_TOO_LONG: 'Email must be less than 256 characters',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_TOO_LONG: 'Password must be less than 64 characters',
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name must be less than 50 characters',
} as const
