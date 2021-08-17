/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} data 
 * @returns Object
 */
const sendSuccessResponse = (req, res, data) => {
    return res.send({
        status: 1,
        data
    });
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Number} statusCode 
 * @param {String} prettyMsg 
 * @param {Error} error 
 * @returns Object
 */
const sendErrorResponse = (req, res, statusCode = 500, prettyMsg, error) => {
    return res.status(statusCode).send({
        status: 0,
        prettyMsg,
        errorMessage: error.toString(),
        error: error.stack
    });
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} prettyMsg 
 * @param {Error} error 
 * @returns Object
 */
const sendWrongInputResponse = (req, res, prettyMsg, data) => {
    return res.status(400).send({
        status: 0,
        prettyMsg,
        data
    });
}

module.exports = {
    sendSuccessResponse,
    sendErrorResponse,
    sendWrongInputResponse
}