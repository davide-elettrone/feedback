import React from "react";
import StepWizard from "react-step-wizard";
import QuestionDisplay, { QuestionType } from "../utils/QuestionDisplays";
// TODO: ELIMINARE LA SEGUENTE RIGA
import questionario from '../questionario1.json';
import { matchPath, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import Request from "../utils/Request";

/**
 * @typedef {{id: number, optionUi: string, label: string, weight: number}} Option
 */

/**
 * @typedef {{id: number, questionUi: string, title: string, subtitle: string, type: QuestionType,
 * placeHolder: string, maxLengthAnswer: number, condition: string, options: Option[]}} Question
 */

/**
 * @typedef {{id: number, feedbackQuestion: Question, answerReference: number, answerText: string}} Answer
 */

export default class Feedback extends React.Component {
    constructor(props){
        super(props);

        /**
         * @type {{feedbackAnswer: {id: number, feedbackAnswerUi: string,
         * template: {id: number, feedbackUi: string, name: string, description: string, validFrom: Date, validTo: Date,
         * questions: Question[]}, timestamp: Date, completed: boolean, answers: Answer[]}, finished: boolean}}
         */
        this.state = {
            feedbackAnswer: 
                {
                    template: {
                        questions: questionario
                    },
                    answers: []
                }
            ,
            finished: false
        };

        this.updateFeedback = this.updateFeedback.bind(this);
        this.sendFeedback = this.sendFeedback.bind(this);
    }

    async componentDidMount(){
        // TODO: decommentare la seguente parte
        // const { params } = matchPath('/feedbacks/:feedbackUi', window.location.pathname);
        // const feedbackAnswer = await Request.get('/feedback/' + params.feedbackUi);
        // this.setState({feedbackAnswer: feedbackAnswer.template});
    }
    
    render(){
        if(this.state.finished) return <Navigate to='/thankyou'/>

        console.log(this.state.feedbackAnswer);

        /**
         * @param {Answer[]} feedback
         */
        const checker = function(feedback, condition){
            if(condition === undefined) return true;
            
            const risposta = feedback.find(answer => answer.feedbackQuestion.id === condition.id);
            if(risposta === undefined) return false;
            return (risposta.answerReference === condition.answerReference &&
                risposta.answerReference !== -1) || risposta.answerText === condition.answerText;
        }

        return <>
            <img id="Logo" src="/elettrone-logo.png" alt="Logo"/>
            <StepWizard transitions={{
                enterLeft: 'animate__animated animate__slideInLeft',
                enterRight: 'animate__animated animate__slideInRight',
                exitLeft: 'animate__animated animate__fadeOutLeft',
                exitRight: 'animate__animated animate__fadeOutRight',
                intro: 'animate__animated animate__slideInUp'
            }} nav={<NavBar/>}>
                {
                    this.state.feedbackAnswer.template.questions
                        .filter(question => checker(this.state.feedbackAnswer.answers, question.condition))
                        .map((question, index) => <QuestionDisplay
                        index={index + 1}
                        onChange={this.updateFeedback}
                        onSend={this.sendFeedback}
                        key={index}
                        question={question}/>)
                }
            </StepWizard>
        </>
    }

    /**
     * Function to update the feedback
     * @param {Answer} answer answer
     */
    updateFeedback(answer){
        const feedbackAnswer = this.state.feedbackAnswer;
        const index = feedbackAnswer.answers.findIndex(val => val.feedbackQuestion.id === answer.feedbackQuestion.id);
        if(index === -1) feedbackAnswer.answers.push(answer);
        else feedbackAnswer.answers[index] = answer;
        this.setState({feedbackAnswer: feedbackAnswer});
    }
    
    async sendFeedback(){
        console.log(this.state.feedback);
        // TODO: decommentare le seguenti righe
        await Request.post('feedbacks/send', this.state.feedbackAnswer)
        this.setState({finished: true});
    }
}