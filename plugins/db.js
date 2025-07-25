const Redis = require("ioredis");
// const { Redis } = require("@upstash/redis");
const mysql = require("mysql2/promise");

const { createClient } = require("@supabase/supabase-js");
const fp = require("fastify-plugin");
const { Pool, Client } = require("pg");
module.exports = fp(async (fastify, opts) => {
  /**
   * Database Connection using Supabase
   */

  await fastify.decorate("cacheConn", await new Redis(process.env.CACHE_URL));

  await fastify.decorate(
    "epDbConn",
    new Pool({
      connectionString: process.env.EASY_PLUGINZ__DB_URL,
    })
  );
});
