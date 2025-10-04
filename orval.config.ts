import 'dotenv/config'
import { defineConfig } from 'orval'

const SWAGGER_URL = process.env.VITE_SWAGGER_URL ?? 'http://localhost:4000/swagger/json'

export default defineConfig({
  defaultClient: {
    input: {
      target: SWAGGER_URL,
    },
    output: {
      target: 'src/shared/api/client.ts',
      client: 'vue-query',
      httpClient: 'axios',
      prettier: true,
      override: {
        mutator: {
          path: './src/shared/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: false,
        },
        contentType: {
          include: ['application/json'],
        },
      },
    },
  },
})
