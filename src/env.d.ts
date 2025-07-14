/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// env.json 类型定义
declare module '@/env.json' {
  const env: {
    baseUrl: string
    ws: string
    updateId: string
    trackId: string
    loggerId: string
  }
  export default env
  export const baseUrl: string
  export const ws: string
  export const updateId: string
  export const trackId: string
  export const loggerId: string
}
