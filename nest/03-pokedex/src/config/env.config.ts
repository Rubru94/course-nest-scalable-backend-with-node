// this config is only for nest
export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3001, // this is not available in main.ts
  defaultLimit: +process.env.DEFAULT_SEARCH_LIMIT || 5,
  defaultOffset: +process.env.DEFAULT_SEARCH_OFFSET || 0,
});
