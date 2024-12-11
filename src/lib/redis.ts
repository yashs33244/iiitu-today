// src/lib/redis.ts
import Redis from 'ioredis';

export const redis = process.env.NODE_ENV === 'production'
//@ts-ignore
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: 'localhost',
      port: 6379
    });