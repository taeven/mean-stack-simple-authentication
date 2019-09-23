const Joi = require("@hapi/joi");
require("dotenv").config();

const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow("development", "production", "test", "provision")
        .default("development"),
    SERVER_PORT: Joi.number().default(4040),
    MONGOOSE_DEBUG: Joi.boolean().when("NODE_ENV", {
        is: Joi.string().equal("development"),
        then: Joi.boolean().default(true),
        otherwise: Joi.boolean().default(false)
    }),
    JWT_SECRET: Joi.string()
        .required()
        .description("JWT Secret required to sign"),
    MONGO_HOST: Joi.string()
        .required()
        .description("mongo hostname is required i.e. 127.0.0.1"),
    MONGO_PORT: Joi.number().default(27017),
    SALT_ROUNDS: Joi.number().default(12)
})
    .unknown()
    .required();

const { env, error, warning } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: process.env.NODE_ENV,
    port: process.env.SERVER_PORT,
    mongooseDebug: process.env.MONGOOSE_DEBUG,
    jwtSecret: process.env.JWT_SECRET,
    frontend: process.env.MEAN_FRONTEND || "angular",
    mongo: {
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT
    },
    saltRounds: process.env.SALT_ROUNDS
};

module.exports = config;
