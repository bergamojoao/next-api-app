import Joi from "joi";
import { ValidationError } from "errors/index";

export default function validator(object: any, keys: any) {
  // Force the clean up of "undefined" values since JSON
  // doesn't support them and Joi doesn't clean
  // them up. Also handles the case where the
  // "object" is not a valid JSON.
  try {
    object = JSON.parse(JSON.stringify(object));
  } catch (error) {
    throw new ValidationError("Não foi possível interpretar o valor enviado.");
  }

  let finalSchema = Joi.object().required().min(1).messages({
    "object.base": `Body enviado deve ser do tipo Object.`,
    "object.min": `Objeto enviado deve ter no mínimo uma chave.`,
  });

  for (const key of Object.keys(keys)) {
    const keyValidationFunction = schemas[key as keyof typeof schemas];
    finalSchema = finalSchema.concat(keyValidationFunction());
  }

  const { error, value } = finalSchema.validate(object, {
    stripUnknown: true,
    context: {
      required: keys,
    },
  });

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  return value;
}

const schemas = {
  id: function () {
    return Joi.object({
      id: Joi.string()
        .allow(null)
        .trim()
        .guid({ version: "uuidv4" })
        .when("$required.id", {
          is: "required",
          then: Joi.required(),
          otherwise: Joi.optional(),
        })
        .messages({
          "any.required": `"id" é um campo obrigatório.`,
          "string.empty": `"id" não pode estar em branco.`,
          "string.base": `"id" deve ser do tipo String.`,
          "string.guid": `"id" deve possuir um token UUID na versão 4.`,
        }),
    });
  },

  name: function () {
    return Joi.object({
      name: Joi.string()
        .max(128)
        .trim()
        .invalid(null)
        .when("$required.name", {
          is: "required",
          then: Joi.required(),
          otherwise: Joi.optional(),
        })
        .messages({
          "any.required": `"name" é um campo obrigatório.`,
          "string.empty": `"name" não pode estar em branco.`,
          "string.base": `"name" deve ser do tipo String.`,
          "any.invalid": `"name" possui o valor inválido "null".`,
        }),
    });
  },

  email: function () {
    return Joi.object({
      email: Joi.string()
        .email()
        .min(7)
        .max(254)
        .lowercase()
        .trim()
        .invalid(null)
        .when("$required.email", {
          is: "required",
          then: Joi.required(),
          otherwise: Joi.optional(),
        })
        .messages({
          "any.required": `"email" é um campo obrigatório.`,
          "string.empty": `"email" não pode estar em branco.`,
          "string.base": `"email" deve ser do tipo String.`,
          "string.email": `"email" deve conter um email válido.`,
          "any.invalid": `"email" possui o valor inválido "null".`,
        }),
    });
  },

  password: function () {
    return Joi.object({
      password: Joi.string()
        .min(8)
        .max(72)
        .trim()
        .invalid(null)
        .when("$required.password", {
          is: "required",
          then: Joi.required(),
          otherwise: Joi.optional(),
        })
        .messages({
          "any.required": `"password" é um campo obrigatório.`,
          "string.empty": `"password" não pode estar em branco.`,
          "string.base": `"password" deve ser do tipo String.`,
          "string.min": `"password" deve conter no mínimo {#limit} caracteres.`,
          "string.max": `"password" deve conter no máximo {#limit} caracteres.`,
          "any.invalid": `"password" possui o valor inválido "null".`,
        }),
    });
  },

  created_at: function () {
    return Joi.object({
      created_at: Joi.date()
        .when("$required.created_at", {
          is: "required",
          then: Joi.required(),
          otherwise: Joi.optional(),
        })
        .messages({
          "any.required": `"created_at" é um campo obrigatório.`,
          "string.empty": `"created_at" não pode estar em branco.`,
          "string.base": `"created_at" deve ser do tipo Date.`,
        }),
    });
  },

  updated_at: function () {
    return Joi.object({
      updated_at: Joi.date()
        .when("$required.updated_at", {
          is: "required",
          then: Joi.required(),
          otherwise: Joi.optional(),
        })
        .messages({
          "any.required": `"updated_at" é um campo obrigatório.`,
          "string.empty": `"updated_at" não pode estar em branco.`,
          "string.base": `"updated_at" deve ser do tipo Date.`,
        }),
    });
  },
};
