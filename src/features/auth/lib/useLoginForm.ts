import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { LoginFormSchema } from './schema'
import { useLogin } from '@/shared/composables/useAuth'

export function useLoginForm() {
  const loginMutation = useLogin()

  const { handleSubmit, errors } = useForm({
    validationSchema: toTypedSchema(LoginFormSchema),
    initialValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values)
  })

  return { onSubmit, errors, loginMutation }
}
