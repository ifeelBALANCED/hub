export const getEnvVariable = (key: keyof ImportMetaEnv, defaultValue?: string): string => {
  const value = import.meta.env[key]
  if (!value && defaultValue === undefined) {
    throw new Error(`Env variable ${key} is not defined`)
  }
  return String(value || defaultValue)
}

const getBackendUrl = (): string => {
  const backendUrl = getEnvVariable('VITE_BACKEND_URL', 'http://localhost:9000')

  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return backendUrl.replace('http://', 'https://')
  }

  return backendUrl
}

export const appEnv = {
  MODE: getEnvVariable('VITE_NODE_ENV', 'development'),
  BASE_URL: getEnvVariable('VITE_BASE_URL', '/'),
  PORT: getEnvVariable('VITE_PORT', '5173'),
  HOST: getEnvVariable('VITE_HOST', 'localhost'),
  PREVIEW_PORT: getEnvVariable('VITE_PREVIEW_PORT', '4173'),
  SWAGGER_URL: getEnvVariable('VITE_SWAGGER_URL', 'http://localhost:8080/api/v1/swagger.json'),
  BACKEND_URL: getBackendUrl(),
}
