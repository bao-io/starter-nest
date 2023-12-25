export const __ENV__ = process.env.NODE_ENV
export const __DEV__ = Object.is(__ENV__, 'development')

export default () => ({
  app: {
    name: process.env.APP_NAME || 'nest',
    port: Number.parseInt(process.env.API_PORT, 10) || 9000,
    apiPrefix: process.env.API_PREFIX || '/api',
  },
})
