import { createClient } from 'redis';

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    connectTimeout: 10000, // 10 seconds
  },
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

const connectRedis = async () => {
  if (!client.isOpen) {
    try {
      await client.connect();
      console.log('Redis client connected');
    } catch (err) {
      console.error('Error connecting to Redis:', err);
    }
  }
};

const pingRedis = async () => {
  try {
    const response = await client.ping();
    console.log('Ping response:', response); // Should print "PONG"
  } catch (err) {
    console.error('Error during ping:', err);
  }
};

export { client, connectRedis, pingRedis };
