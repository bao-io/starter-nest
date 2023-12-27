export const __ENV__ = process.env.NODE_ENV
export const __DEV__ = Object.is(__ENV__, 'development')

export default () => ({
  app: {
    name: process.env.APP_NAME || 'nest',
    port: process.env.APP_PORT || 9000,
  },
})
