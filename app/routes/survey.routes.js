const { authJwt } = require("../middlewares");
const controller = require("../controllers/survey.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Cast Vote: Only user can cast vote
    app.post(
        "/survey/vote/:questionId/:optionId",
        [authJwt.verifyToken, authJwt.isUser],
        controller.vote
    );

    // Check if user has voted: Only user can check if user has voted
    app.get(
        "/survey/hasVoted/:questionId",
        [authJwt.verifyToken, authJwt.isUser],
        controller.hasVoted
    );

    // Get questions user has not voted: Only user can get question user has not voted
    app.get(
        "/survey/getQuestionsNotVoted",
        [authJwt.verifyToken, authJwt.isUser],
        controller.getQuestionsNotVoted
    );

    // Get total votes: Only admin can get total votes
    app.get(
        "/survey/getTotalResponses/:questionId",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getTotalResponses
    );

    // Get total votes for each option
    app.get(
        "/survey/getQuestionResponse/:questionId",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getQuestionResponse
    );

    // Get total votes
    app.get(
        "/survey/getSurveyResponse",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getSurveyResponse
    );

};
