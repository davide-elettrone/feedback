import React from "react";
import StepWizard from "react-step-wizard";
import QuestionDisplay from "../utils/QuestionDisplays";
import questionario from '../questionario1.json';
import { Navigate } from "react-router-dom";

export default class Feedback extends React.Component {
    constructor(props){
        super(props);

        /**
         * @type {{feedback: {questionId: number, answer: Answer}[]}}
         */
        this.state = {
            feedback: [],
            finished: false
        };

        this.updateFeedback = this.updateFeedback.bind(this);
        this.sendFeedback = this.sendFeedback.bind(this);
    }
    
    render(){
        if(this.state.finished) return <Navigate to='/thankyou'/>

        /**
         * @param {{ questionId: number, answer: Answer }[]} feedback
         * @param {{ questionId: number, answer: Answer }} condition
         */
        const checker = function(feedback, condition){
            if(condition === undefined) return true;

            const deepEquality = function(obj1, obj2){
                const keys = Object.keys(obj1);

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if(obj2[key] === undefined){
                        return false;
                    }
                    if(typeof obj1[key] === 'object'){
                        if(!deepEquality(obj1[key], obj2[key])) return false;
                    }
                    else if(obj1[key] !== obj2[key]){
                        return false;
                    }
                }

                return true;
            }
            
            const risposta = feedback.find(answer => answer.questionId === condition.questionId);
            if(risposta === undefined) return false;
            return deepEquality(risposta.answer, condition.answer);
        }

        return (
            <StepWizard transitions={{
                enterLeft: 'animate__animated animate__slideInLeft',
                enterRight: 'animate__animated animate__slideInRight',
                exitLeft: 'animate__animated animate__fadeOutLeft',
                exitRight: 'animate__animated animate__fadeOutRight',
                intro: 'animate__animated animate__slideInUp'
            }}>
                {
                    questionario
                        // controlla ogni condizione
                        .filter(question => checker(this.state.feedback, question.condition))
                        .map((question, index) => <QuestionDisplay
                        index={index + 1}
                        onChange={this.updateFeedback}
                        onSend={this.sendFeedback}
                        key={index}
                        question={question}/>)
                }
            </StepWizard>
        )
    }

    /**
     * Function to update the feedback
     * @param {number} questionId question id
     * @param {Answer} answer answer
     */
    updateFeedback(questionId, answer){
        const feedback = this.state.feedback;
        const index = feedback.findIndex(val => val.questionId === questionId);
        if(index === -1) feedback.push({questionId: questionId, answer: answer});
        else feedback[index].answer = answer;
        this.setState({feedback: feedback});
    }
    
    sendFeedback(){
        console.log(this.state.feedback);
        this.setState({finished: true});
    }
}