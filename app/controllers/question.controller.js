const db = require("../models");
const Question = db.question;
const Result = db.result;

module.exports = {
    addQuestion: async (req, res) => {
        try {
            const { question, options } = req.body

            if (!question || !options) {
                return res.status(400).send({
                    message: "Please provide all required fields"
                })
            }

            // Check if question already exists
            const existingQuestion = await Question.findOne({ question: question })
            if (existingQuestion) {
                return res.status(400).send({
                    message: "Question already exists"
                })
            }

            const questionCollection = new Question({
                question: question,
                options: options.map(option => {
                    return {
                        id: Math.floor(Math.random() * 1000) + 1,
                        option: option,
                    }
                })
            });

            questionCollection.save(questionCollection)
                .then(data => {
                    if (!data) {
                        res.status(404).send({ message: "Error while adding question" })
                    }
                    else {
                        res.status(200).send();
                    }
                })
                .catch(error => {
                    res.status(500).send({
                        message: error.message || "Some error occurred while adding question"
                    })
                })
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while adding question"
            })
        }
    },

    getAllQuestions: async (req, res) => {
        try {
            Question.find()
                .then(data => {
                    if (!data) {
                        res.status(200).send([]);
                    }
                    else {
                        res.status(200).send({
                            consulations: {
                                Questions: data.map(question => {
                                    return {
                                        id: question._id,
                                        Text: question.question,
                                    }
                                }),
                            }
                        });
                    }
                })
                .catch(error => {
                    res.status(500).send({
                        message: error.message || "Some error occurred while retrieving question"
                    })
                })
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while retrieving questions"
            })
        }
    },

    getQuestionOptions: async (req, res) => {
        try {
            const { id } = req.params

            if (!id) {
                return res.status(400).send({
                    message: "Please provide all required fields"
                })
            }

            Question.find({ _id: id })
                .then(data => {
                    if (!data) {
                        res.status(404).send([]);
                    }
                    else {
                        var response = {};
                        data.forEach(item => {
                            response.Question = item._id;
                            response.Options = item.options.map(option => {
                                return {
                                    id: option.id,
                                    Text: option.option,
                                };
                            });
                        });

                        res.status(200).send(response);
                    }
                })
                .catch(error => {
                    res.status(500).send({
                        message: error.message || "Some error occurred while retrieving question options"
                    })
                })
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while retrieving question options"
            })
        }
    },

    deleteQuestion: async (req, res) => {
        try {
            const { id } = req.params

            if (!id) {
                return res.status(400).send({
                    message: "Please provide all required fields"
                })
            }

            // Check if question exists in results
            const existingQuestion = await Result.findOne({ questionId: id })
            if (existingQuestion) {
                return res.status(400).send({
                    message: "Question already voted. Cannot delete."
                })
            }

            Question.findByIdAndRemove(id)
                .then(data => {
                    if (!data) {
                        res.status(404).send({ message: "Question not found with id " + id });
                    }
                    else {
                        res.status(200).send({ message: "Question deleted successfully!" });
                    }
                })
                .catch(error => {
                    res.status(500).send({
                        message: error.message || "Some error occurred while deleting question"
                    })
                })
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while deleting question"
            })
        }
    },

    updateQuestion: async (req, res) => {
        try {
            const { id } = req.params
            const { question, options } = req.body

            if (!id || !question || !options || !options.length) {
                return res.status(400).send({
                    message: "Please provide all required fields"
                })
            }


            // Check if question exists in results
            const existingQuestion = await Result.findOne({ questionId: id })
            if (existingQuestion) {
                return res.status(400).send({
                    message: "Question already voted. Cannot update."
                })
            }

            Question.findByIdAndUpdate(id, {
                question: question,
                options: options.map(option => {
                    return {
                        id: Math.floor(Math.random() * 1000) + 1,
                        option: option,
                    }
                })
            }, { new: true })
                .then(data => {
                    if (!data) {
                        res.status(404).send({ message: "Question not found with id " + id });
                    }
                    else {
                        res.status(200).send({
                            id: data._id,
                            question: data.question,
                            options: data.options.map(option => {
                                return {
                                    id: option.id,
                                    Text: option.option,
                                }
                            })
                        });
                    }
                })
                .catch(error => {
                    res.status(500).send({
                        message: error.message || "Some error occurred while updating question"
                    })
                })
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while updating question"
            })
        }
    },
}