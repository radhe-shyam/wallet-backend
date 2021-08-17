const mongoose = require('mongoose');
const { MongoError } = require('mongodb');
const { sendErrorResponse, sendWrongInputResponse } = require('./response');

/**
 * 
 * @param {Error} error 
 * @param {req} req 
 * @param {res} res 
 * @param {Function} next 
 * @returns 
 */
const errorHandler = (error, req, res, next) => {
    try {
        if (error instanceof SyntaxError) { // it will handle invalid JSON object
            return sendWrongInputResponse(req, res, 'Invalid request', { error: error.toString() });
        }
        if (error && error.error && error.error.isJoi) { //it will handle joi validation
            return sendWrongInputResponse(req, res, error.error.toString().replace(/\"/g, ''), error.error.details);
        }
        if (error instanceof mongoose.Error.ValidationError || error instanceof MongoError) {
            const data = {};
            if (error.code === 11000) { //mongoose code represent duplicate record
                for (const key in error.keyValue) {
                    data[key] = `${error.keyValue[key]} has already been used.`
                }
            } else {
                req.log.warn({ error });
                for (const key in error.errors) {
                    data[key] = error.errors[key].message;
                }
            }
            return sendWrongInputResponse(req, res, "Validation failed", data);
        }
    } catch (err) {
        error = err;
    }
    sendErrorResponse(req, res, 500, `Something went wrong`, error);
    req.log.info(error);
}

/**
 * 
 * @param {req} req 
 * @param {res} res 
 * @param {Function} next 
 * @returns 
 */
const path404Handler = (req, res, next) => sendErrorResponse(req, res, 404, `Path Not found - ${req.url}`, new Error('Not Found'))

module.exports = {
    errorHandler,
    path404Handler
}