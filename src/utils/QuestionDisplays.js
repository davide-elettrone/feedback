import { useState } from "react";
// eslint-disable-next-line
import Feedback, { Answer } from "../pages/Feedback";
// eslint-disable-next-line
import { Question, Option } from "../pages/Feedback";

/**
 * @enum {QuestionType} question type
 */
 const QuestionType = {
    FreeAnswer: 'free-answer',
    Options: 'options',
    Rating: 'rating',
    MultiSelect: 'multi-select'
}

/**
 * Generic wizard step object
 * @param {{title: string, subtitle: string | undefined, className: string | undefined, id: string | undefined, index: number
 * currentStep: number, totalSteps: number, goToStep: function(number): void, sendFeedback: function(): void}} props properties
 */
function WizardStepObject(props){
    return <div className={props.className || 'Step'} id={props.id}>
        <div className="Header">
            <h1>{props.title}</h1>
            <h3><small>{props.subtitle}</small></h3>
        </div>
        <div className="Content">
            {props.children}
            {getButtons(props.index, props.totalSteps, props.goToStep, props.sendFeedback)}
        </div>
    </div>
}

/**
 * Function to get the right button set and navigation
 * @param {number} step question step
 * @param {number} totalSteps total step number
 * @param {function(number): void} goToStep go to step function
 * @param {function(): void} sendFeedback send feedback callback
 * @returns buttons
 */
const getButtons = function(step, totalSteps, goToStep, sendFeedback){

    if(totalSteps === 1){
        return <div className="FeedbackButton">
            <button onClick={sendFeedback}>Invia</button>
        </div>
    }

    if(step === 1){
        return <div className="FeedbackButton">
            <button onClick={() => goToStep(step + 1)}>Avanti</button>
        </div>
    }

    if(step === totalSteps){
        return <div className="FeedbackButton">
            <button onClick={() => goToStep(step - 1)}>Indietro</button>
            <button onClick={sendFeedback}>Invia</button>
        </div>
    }

    return <div className="FeedbackButton">
        <button onClick={() => goToStep(step - 1)}>Indietro</button>
        <button onClick={() => goToStep(step + 1)}>Avanti</button>
    </div>
}

/**
 * @callback updateFeedbackCallback
 * @param {Answer} answer
 * @return void
 */

/**
 * Simple feedback page
 * @param {{question: Question, checker: function(Answer): boolean, index: number,
 * onChange: updateFeedbackCallback, onSend: function(): void}} props properties
 * @returns A feedback Page
 */
export default function QuestionDisplay(props){
    return <WizardStepObject index={props.index} goToStep={props.goToStep} currentStep={props.currentStep} totalSteps={props.totalSteps}
        className="Question" id={props.question.id} sendFeedback={props.onSend}
        title={props.question.title} subtitle={props.question.subtitle}>
        {getQuestion(props.question, props.onChange)}
    </WizardStepObject>
}

/**
 * Function to get the correct question object
 * @param {Question} question question to display
 */
 const getQuestion = function(question, onChange){
    switch (question.questionType) {
        case QuestionType.FreeAnswer:
            return <FreeAnswerQuestionDisplay onChange={onChange} question={question}/>
        case QuestionType.Options:
            return <OptionQuestionDisplay onChange={onChange} question={question}/>
        case QuestionType.Rating:
            return <RatingQuestionDisplay onChange={onChange} question={question}/>
        case QuestionType.MultiSelect:
            return <MultiSelectDisplay onChange={onChange} question={question}/>
        default:
            return <></>
    }
}

/**
 * Simple text feedback
 * @param {{question: Question}} props properties
 */
function FreeAnswerQuestionDisplay(props){
    return (<div className="FreeAnswerQuestion">
        <input type='text' onChange={event => props.onChange({feedbackQuestion: props.question, answerText: event.target.value})}
        maxLength={props.question.maxLength} id={props.question.id} defaultValue={props.question.defaultValue}
        placeholder={props.question.placeHolder}/>
    </div>)
}

/**
 * Simple radio feedback
 * @param {{question: Question}} props properties
 */
function OptionQuestionDisplay(props){
    return (
        <div className="OptionsQuestion" id={props.question.id}>
            {
                props.question.options.map((val, index) =>{
                    return <div key={index}>
                        <input
                        name={props.question.id}
                        defaultChecked={index === props.defaultValue || val.label === props.defaultValue}
                        id={props.question.id + "/" + val.id}
                        type="radio"
                        value={val.id}
                        onChange={() => props.onChange({ feedbackQuestion: props.question, answerReference: val.id})}/>

                        <label
                        htmlFor={props.question.id + '/' + val.id}>
                            {val.label}
                        </label>
                    </div>
                })
            }
            {
                props.question.other ?
                <div>
                    <input
                    name={props.question.id}
                    className="DontExpand"
                    id={props.question.id + "/altro"}
                    type="radio"/>

                    <input
                    placeholder='altro'
                    type='text'
                    onChange={event => {
                        const radio = document.getElementById(props.question.id + "/altro");
                        radio.value = event.target.value.trim();
                        props.onChange(props.question.id, { feedbackQuestion: props.question, answerReference: -1, answerText: radio.value });
                    }}
                    onClick={() => {
                        const radio = document.getElementById(props.question.id + "/altro");
                        radio.checked = true;
                        props.onChange(props.question.id, { feedbackQuestion: props.question, answerReference: -1, answerText: radio.value });
                    }}
                    />  
                </div> : <></>
            }
        </div>
    )
}

/**
 * Simple radio feedback
 * @param {{question: Question}} props properties
 */
function MultiSelectDisplay(props){
    let answer = [];

    return (
        <div className="MultiSelectQuestion" id={props.question.questionId}>
            {
                props.question.options.map((val, index) =>{
                    return <div key={index}>
                        <input
                        name={props.question.questionId}
                        defaultChecked={index === props.defaultValue || val.label === props.defaultValue}
                        id={props.question.questionId + "/" + val.id}
                        type="checkbox"
                        value={val.id}
                        onChange={event => {
                            if(event.target.checked){
                                answer.push({ feedbackQuestion: props.question, answerReference: val.id });
                            }
                            else{
                                answer = answer.filter(selection => selection.feedbackQuestion.id !== val.id);
                            }
                            props.onChange(props.question.id, answer);
                        }}/>

                        <label
                        htmlFor={props.question.id + '/' + val.id}>
                            {val.label}
                        </label>
                    </div>
                })
            }
            {
                props.question.other ?
                <div>
                    <input
                    name={props.question.id}
                    id={props.question.id + "/altro"}
                    type="checkbox"/>

                    <input
                    placeholder='altro'
                    type='text'
                    onChange={event => {
                        const checkbox = document.getElementById(props.question.questionId + "/altro");
                        const val = event.target.value.trim()
                        checkbox.value = val;
                        checkbox.checked = val && val !== '';
                        if(checkbox.checked){
                            const index = answer.findIndex(val => val.answerId === -1);
                            if(index === -1) answer.push({ answerId: -1, value: val});
                            else answer[index] = { answerId: -1, value: val};
                        }
                        else{
                            answer = answer.filter(selection => selection.answerId !== -1);
                        }
                        props.onChange(props.question.id, answer);
                    }}
                    />  
                </div> : <></>
            }
        </div>
    )
}

/**
 * Simple rating question
 * @param {{question: Question}} props properties
 */
function RatingQuestionDisplay(props){
    const getWeight = function(){
        const answer = props.question.options.find(opt => opt.id === Number(value) || opt.label === value)?.weight;
        if(answer === undefined) return -1;
        return answer;
    }

    const [value, setValue] = useState();
    const weight = getWeight();

    return <div className="RatingQuestion">
        {
            props.question.options
                .sort((first, second) => first.weight - second.weight)
                .map((val, index) => {
                    return <label key={index} htmlFor={props.question.id + '/' + val.id}>
                        <input
                        name={props.question.id}
                        checked={val.weight <= weight}
                        className="DontExpand"
                        id={props.question.id + "/" + val.id}
                        type="checkbox"
                        value={val.id}
                        onChange={() => {
                            const newVal = val.id;
                            setValue(newVal);
                            props.onChange({ feedbackQuestion: props.question, answerReference: newVal});
                        }}/>
                        <label htmlFor={props.question.id + '/' + val.id} className=""/>
                        <label htmlFor={props.question.id + '/' + val.id}>
                            {val.label}
                        </label>
                    </label>
                })
        }
    </div>
}

export { QuestionType, WizardStepObject, FreeAnswerQuestionDisplay, OptionQuestionDisplay, RatingQuestionDisplay };