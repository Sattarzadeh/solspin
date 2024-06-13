import Redis from 'ioredis';

const redis = new Redis({
  host: '0.0.0.0',
  port: 6379,
  password: undefined,
  connectTimeout: 10000, // 10 seconds
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Comment out connect log to avoid async issue in tests
// redis.on('connect', () => {
//   console.log('Connected to Redis');
// });

export default redis;
