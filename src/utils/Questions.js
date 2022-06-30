class Question{
    /**
     * Simple question object
     * @param {number} questionId question id
     * @param {string} questionUi question ui
     * @param {string} questionText question text
     * @param {string | undefined} questionInfo question's info
     * @param {QuestionType} questionType question type
     * @param {number | string} defaultValue question default value
     * @param {{ questionId: number, answer: number | number[] | string } | undefined} condition condition to show the page
     */
    constructor(questionId, questionUi, questionText, questionInfo, questionType, defaultValue, condition){
        this.questionId = questionId;
        this.questionUi = questionUi;
        this.questionText = questionText;
        this.questionInfo = questionInfo;
        this.questionType = questionType;
        this.defaultValue = defaultValue;
        this.condition = condition;
    }
}

class FreeAnswerQuestion extends Question{
    /**
     * Simple free answer question object
     * @param {number} questionId question id
     * @param {string} questionUi question ui
     * @param {string} questionText question text
     * @param {string | undefined} questionInfo question's info
     * @param {QuestionType} questionType question type
     * @param {number | string} defaultValue question default value
     * @param {number} maxLength answer max character length
     * @param {string} placeHolder input placeHolder
     */
    constructor(questionId, questionUi, questionText, questionInfo, questionType, defaultValue, maxLength, placeHolder){
        super(questionId, questionUi, questionText, questionInfo, questionType, defaultValue);
        this.maxLength = maxLength;
        this.placeHolder = placeHolder;
    }
}

/**
 * @typedef {{optionId: number, optionLabel: string}} option option object
 */
class OptionsQuestion extends Question{
    /**
     * Simple free answer question object
     * @param {number} questionId question id
     * @param {string} questionUi question ui
     * @param {string} questionText question text
     * @param {string | undefined} questionInfo question's info
     * @param {QuestionType} questionType question type
     * @param {number | string} defaultValue question default value
     * @param {option[]} options answer max character length
     * @param {boolean} other accept free answer
     */
    constructor(questionId, questionUi, questionText, questionInfo, questionType, defaultValue, options, other){
        super(questionId, questionUi, questionText, questionInfo, questionType, defaultValue);
        this.options = options;
        this.other = other;
    }
}

/**
 * @typedef {{optionId: number, optionLabel: string | undefined, optionWeight: number}} ratingOption
 */
class RatingQuestion extends Question{
    /**
     * Simple rating object
     * @param {number} questionId question id
     * @param {string} questionUi question ui
     * @param {string} questionText question text
     * @param {string | undefined} questionInfo question's info
     * @param {QuestionType} questionType question type
     * @param {number | string} defaultValue question default value
     * @param {ratingOption[]} options rating options
     * @param {string} ratingType
     */
     constructor(questionId, questionUi, questionText, questionInfo, questionType, defaultValue, options){
        super(questionId, questionUi, questionText, questionInfo, questionType, defaultValue);
        this.options = options;
    }
}

export { Question, FreeAnswerQuestion, OptionsQuestion, RatingQuestion };