const { authJwt } = require("../middlewares");
const controller = require("../controllers/question.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Add new question: Only admin can add new question
    app.post(
        "/AddQuestion",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.addQuestion
    );

    // Get all questions: Every Signed In user (including admin) 
    // can get all questions
    app.get(
        "/GetAllQuestions",
        // [authJwt.verifyToken],
        controller.getAllQuestions
    );

    // Get a question's options: Every Signed In user (including admin) 
    // can get a question's options
    app.get(
        "/GetQuestionOptions/:id",
        // [authJwt.verifyToken],
        controller.getQuestionOptions
    );

    // Delete question: Only admin can delete question
    app.delete(
        "/DeleteQuestion/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteQuestion
    );

    // Update question: Only admin can update question
    app.put(
        "/UpdateQuestion/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.updateQuestion
    );
};
