const db = require("../models");
const Question = db.question;
const Result = db.result;
const User = db.user;

module.exports = {
    // Cast Vote
    vote: async (req, res) => {
        try {
            const { questionId, optionId } = req.params;

            if (!questionId || !optionId) {
                return res.status(400).send({
                    message: "Please provide all required fields"
                });
            }

            const question = await Question.findById(questionId);

            if (!question) {
                return res.status(404).send({
                    message: "Question not found"
                });
            }

            // Check if the option exists
            const checkOptionId = question.options.findIndex(
                option => option.id == parseInt(optionId)
            );

            if (checkOptionId < 0) {
                return res.status(404).send({
                    message: "Option not found"
                });
            }

            const user = await User.findById(req.userId);
            if (user) {
                const result = await Result.findOne({
                    questionId: questionId,
                    userId: user._id
                });

                if (!result) {
                    const newResult = new Result({
                        userId: user._id,
                        questionId: questionId,
                        optionId: optionId,
                    });

                    newResult.save(newResult)
                        .then(data => {
                            if (!data) {
                                res.status(404).send({ message: "Error while adding result" });
                            }
                            else {
                                res.status(200).send({ message: "Vote casted successfully" });
                            }
                        })
                        .catch(error => {
                            res.status(500).send({
                                message: error.message || "Some error occurred while adding result"
                            });
                        });
                } else {
                    res.status(200).send({ message: 'You have already voted' });
                }

            }
            else {
                res.status(200).send({ message: 'You are not allowed to vote' });
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: error.message || "Some error occurred while adding result"
            });
        }
    },

    // Check if user has voted 
    hasVoted: async (req, res) => {
        try {
            const { questionId } = req.params;

            if (!questionId) {
                return res.status(400).send({
                    message: "Please provide all required fields"
                });
            }

            const user = await User.findById(req.userId);
            if (user) {
                const result = await Result.findOne({
                    questionId: questionId,
                    userId: user._id
                });

                if (!result) {
                    res.status(200).send({ voted: false });
                } else {
                    res.status(200).send({ voted: true });
                }
            }
            else {
                res.status(200).send({ message: 'You are not allowed to vote' });
            }

        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while adding result"
            });
        }
    },

    // Get questions user has not voted
    getQuestionsNotVoted: async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (user) {
                const questionsVoted = await Result.find({ userId: user._id });
                const questionsNotVoted = await Question.find({
                    _id: { $nin: questionsVoted.map(question => question.questionId) }
                });

                res.status(200).send({
                    questions: questionsNotVoted.map(question => {
                        return {
                            id: question._id,
                            Text: question.question,
                        }
                    })
                });
            }
            else {
                res.status(200).send({ message: 'Unauthorised' });
            }

        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while getting result"
            });
        }
    },

    // Get total votes
    getTotalResponses: async (req, res) => {
        try {
            const { questionId } = req.params;

            if (!questionId) {
                return res.status(400).send({
                    message: "Please provide all required fields"
                });
            }

            const question = await Question.findById(questionId);
            if (!question) {
                return res.status(404).send({
                    message: "Question not found"
                });
            }

            const responses = await Result.find({ questionId: questionId });

            res.status(200).send({
                responses: responses.length
            });

        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while getting result"
            });
        }
    },

    // Get total votes for each option
    getQuestionResponse: async (req, res) => {
        try {
            const { questionId } = req.params;

            if (!questionId) {
                return res.status(400).send({
                    message: "Please provide all required fields"
                });
            }

            const question = await Question.findById(questionId);
            if (!question) {
                return res.status(404).send({
                    message: "Question not found"
                });
            }

            // Get all responses for the question
            const responses = await Result.aggregate([
                {
                    $match: { questionId: questionId }
                },
                {
                    $group: {
                        _id: "$optionId",
                        count: { $sum: 1 }
                    }
                }
            ]);


            // get all options for the question
            const result = await Question.findById(questionId).select('options');
            const response = result.options.map(option => {
                // Check if an option id exists in the response       
                const optionResponse = responses.find(response => response._id == option.id);
                return {
                    id: option.id,
                    count: optionResponse ? String(optionResponse.count) : '0'
                }
            });

            res.status(200).send({
                Question: questionId,
                Answers: response
            });

        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while getting result"
            });
        }
    },

    // Get total votes
    getSurveyResponse: async (req, res) => {
        try {
            // Get all questions
            const questions = await Question.find();

            const responses = await Result.aggregate([
                {
                    $group: {
                        _id: "$questionId",
                        count: { $sum: 1 }
                    }
                }
            ]);

            // add question text to each response
            const result = questions.map(question => {
                // Check if an option id exists in the response
                const questionResponse = responses.find(response => response._id == question._id);
                return {
                    id: question._id,
                    question: question.question,
                    count: questionResponse ? String(questionResponse.count) : '0'
                }
            });

            res.status(200).send({
                survey: result
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while getting result"
            });
        }
    },
}
