import { useEffect, useState } from "react";
// eslint-disable-next-line
import Feedback, { Answer } from "../pages/Feedback";
// eslint-disable-next-line
import { Question, FreeAnswerQuestion, OptionsQuestion, RatingQuestion } from "./Questions";

/**
 * @enum {QuestionType} question type
 */
 const QuestionType = {
    FreeAnswer: 'free answer',
    Options: 'options',
    Rating: 'rating',
    MultiSelect: 'multi select'
}

/**
 * Generic wizard step object
 * @param {{title: string, subtitle: string | undefined, className: string | undefined, id: string | undefined, index: number
 * currentStep: number, totalSteps: number, goToStep: function(number): void, sendFeedback: function(): void}} props properties
 */
function WizardStepObject(props){
    useEffect(() => {
    });

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
        return <div id="FeedbackButton">
            <button className="NextButton" onClick={sendFeedback}>Invia</button>
        </div>
    }

    if(step === 1){
        return <div id="FeedbackButton">
            <button className="NextButton" onClick={() => goToStep(step + 1)}>Avanti</button>
        </div>
    }

    if(step === totalSteps){
        return <div id="FeedbackButton">
            <button onClick={() => goToStep(step - 1)}>Indietro</button>
            <button onClick={sendFeedback}>Invia</button>
        </div>
    }

    return <div id="FeedbackButton">
        <button onClick={() => goToStep(step - 1)}>Indietro</button>
        <button onClick={() => goToStep(step + 1)}>Avanti</button>
    </div>
}

/**
 * @callback updateFeedbackCallback
 * @param {number} questionId
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
        className="Question" id={props.question.questionId} sendFeedback={props.onSend}
        title={props.question.questionText} subtitle={props.question.questionInfo}>
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
 * @param {{question: FreeAnswerQuestion}} props properties
 */
function FreeAnswerQuestionDisplay(props){
    return (<div className="FreeAnswerQuestion">
        <input type='text' onChange={event => props.onChange(props.question.questionId, event.target.value)}
        maxLength={props.question.maxLength} id={props.question.questionId} defaultValue={props.question.defaultValue}
        placeholder={props.question.placeHolder}/>
    </div>)
}

/**
 * Simple radio feedback
 * @param {{question: OptionsQuestion}} props properties
 */
function OptionQuestionDisplay(props){
    return (
        <div className="OptionsQuestion" id={props.question.questionId}>
            {
                props.question.options.map((val, index) =>{
                    return <div key={index}>
                        <input
                        name={props.question.questionId}
                        defaultChecked={index === props.defaultValue || val.optionLabel === props.defaultValue}
                        id={props.question.questionId + "/" + val.optionId}
                        type="radio"
                        value={val.optionId}
                        onChange={() => props.onChange(props.question.questionId, { answerId: val.optionId})}/>

                        <label
                        htmlFor={props.question.questionId + '/' + val.optionId}>
                            {val.optionLabel}
                        </label>
                    </div>
                })
            }
            {
                props.question.other ?
                <div>
                    <input
                    name={props.question.questionId}
                    className="DontExpand"
                    id={props.question.questionId + "/altro"}
                    type="radio"/>

                    <input
                    placeholder='altro'
                    type='text'
                    onChange={event => {
                        const radio = document.getElementById(props.question.questionId + "/altro");
                        radio.value = event.target.value.trim();
                        props.onChange(props.question.questionId, { answerId: -1, value: radio.value });
                    }}
                    onClick={() => {
                        const radio = document.getElementById(props.question.questionId + "/altro");
                        radio.checked = true;
                        props.onChange(props.question.questionId, { answerId: -1, value: radio.value });
                    }}
                    />  
                </div> : <></>
            }
        </div>
    )
}

/**
 * Simple radio feedback
 * @param {{question: OptionsQuestion}} props properties
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
                        defaultChecked={index === props.defaultValue || val.optionLabel === props.defaultValue}
                        id={props.question.questionId + "/" + val.optionId}
                        type="checkbox"
                        value={val.optionId}
                        onChange={event => {
                            if(event.target.checked){
                                answer.push({ answerId: val.optionId });
                            }
                            else{
                                answer = answer.filter(selection => selection.answerId !== val.optionId);
                            }
                            props.onChange(props.question.questionId, answer);
                        }}/>

                        <label
                        htmlFor={props.question.questionId + '/' + val.optionId}>
                            {val.optionLabel}
                        </label>
                    </div>
                })
            }
            {
                props.question.other ?
                <div>
                    <input
                    name={props.question.questionId}
                    id={props.question.questionId + "/altro"}
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
                        props.onChange(props.question.questionId, answer);
                    }}
                    />  
                </div> : <></>
            }
        </div>
    )
}

/**
 * Simple rating question
 * @param {{question: RatingQuestion}} props properties
 */
function RatingQuestionDisplay(props){
    const getWeight = function(){
        const answer = props.question.options.find(opt => opt.optionId === Number(value) || opt.optionLabel === value)?.optionWeight;
        if(answer === undefined) return -1;
        return answer;
    }

    const [value, setValue] = useState(props.question.defaultValue);
    const weight = getWeight();

    return <div className="RatingQuestion">
        {
            props.question.options
                .sort((first, second) => first.optionWeight - second.optionWeight)
                .map((val, index) => {
                    return <label key={index} htmlFor={props.question.questionId + '/' + val.optionId}>
                        <input
                        name={props.question.questionId}
                        checked={val.optionWeight <= weight}
                        className="DontExpand"
                        id={props.question.questionId + "/" + val.optionId}
                        type="checkbox"
                        value={val.optionId}
                        onChange={() => {
                            const newVal = val.optionId;
                            setValue(newVal);
                            props.onChange(props.question.questionId, newVal);
                        }}/>
                        <label htmlFor={props.question.questionId + '/' + val.optionId} className=""/>
                        <label htmlFor={props.question.questionId + '/' + val.optionId}>
                            {val.optionLabel}
                        </label>
                    </label>
                })
        }
    </div>
}

export { QuestionType, WizardStepObject, FreeAnswerQuestionDisplay, OptionQuestionDisplay as OptionsQuestionDisplay, RatingQuestionDisplay };