import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { RegisterFormSchema } from './schema'
import { useRegister } from '@/shared/composables/useAuth'

export function useRegisterForm() {
  const registerMutation = useRegister()

  const { handleSubmit, errors } = useForm({
    validationSchema: toTypedSchema(RegisterFormSchema),
    initialValues: { email: '', password: '', name: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    await registerMutation.mutateAsync(values)
  })

  return { onSubmit, errors, registerMutation }
}
