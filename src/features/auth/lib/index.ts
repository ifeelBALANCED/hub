export { RegisterFormSchema, LoginFormSchema } from './schema'
export type { LoginFormValues, RegisterFormValues } from './schema'
export { mapAuthErrorToField, isAuthError } from './error-mapping'
export {
  AUTH_FORM_FIELDS,
  getFieldsForMode,
  getAuthFormTitle,
  getAuthFormDescription,
  getAuthFormSubmitLabel,
  getAuthFormToggleLabel,
} from './form-fields'
export type { FormFieldConfig } from './form-fields'
