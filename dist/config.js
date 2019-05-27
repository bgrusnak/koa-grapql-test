"use strict";

require("dotenv").config();

var Joi = require("joi");
/**
 * Validates and transforms an object of configuration environment variables.
 */


function configure(input, schema) {
  var config = null;
  Joi.validate(input, schema, function (error, value) {
    if (error) {
      throw error;
    }

    config = value;
  });
  return config;
}

var schema = Joi.object().keys({
  env: Joi.string().valid(["test", "development", "staging", "production"]).required(),
  host: Joi.string().required(),
  port: Joi.number().integer().required()
});
module.exports = configure({
  env: process.env.NODE_ENV || "development",
  host: process.env.HOST,
  port: process.env.PORT
}, schema);