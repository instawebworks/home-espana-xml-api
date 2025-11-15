const fastify = require("fastify")({
  logger: true,
});

const path = require("path");
require("dotenv").config();

const autoload = require("@fastify/autoload");

fastify.register(require("fastify-axios"));
fastify.register(require("@fastify/cors"), {
  origin: "*",
});
// / 
fastify.register(require("@fastify/multipart"), {
  preservePath: true,
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 100, // Max field value size in bytes
    fields: 100, // Max number of non-file fields
    fileSize: 100000000, // For multipart forms, the max file size in bytes
    files: 20, // Max number of file fields
    headerPairs: 2000, // Max number of header key=>value pairs
    parts: 1000, // For multipart forms, the max number of parts (fields + files)
  },
  // attachFieldsToBody: true,
});
fastify.register(require("@fastify/helmet"), { global: true });
fastify.register(require("fastify-uuid"));

/**
 * Autoload Plugins
 */
fastify.register(autoload, {
  dir: path.join(__dirname, "plugins"),
});

/**
 * Autoload Routes
 */
fastify.register(autoload, {
  dir: path.join(__dirname, "routes"),
});

fastify.addHook("onClose", (instance, done) => {
  fastify.epDbConn.end();
  done();
});

fastify.get("/", async (request, reply) => {
  return {
    status: "Admin API Server Running",
    iwebw: request?.iwebw,
    dirname: __dirname,
  };
});

// Run the server!
fastify.listen(
  { port: process.env.PORT || 8080, host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      fastify.log.error(err.message);
      process.exit(1);
    }
  }
);
