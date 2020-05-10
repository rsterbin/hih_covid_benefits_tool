import React, { Component } from 'react';

import StepCounter from '../../../components/BenefitsTool/StepCounter/StepCounter';
import Question from '../../../components/BenefitsTool/Question/Question';
import Controls from '../../../components/UI/Controls/Controls';
import SessionCookies from '../../../utils/SessionCookies';

import QuestionsData from '../../../data/questions.json';

class Quiz extends Component {

    state = {
        step: 0
    };

    questions = QuestionsData;

    componentDidMount() {
        let newStep = SessionCookies.get('current_step');
        if (isNaN(parseInt(newStep))) {
            newStep = 0;
        }
        newStep = parseInt(newStep);
        if (newStep < 0 || newStep >= this.questions.order.length) {
            newStep = 0;
        }
        this.setState({ step: newStep });
    }

    changeStep(newStep) {
        this.setState({ step: newStep });
        SessionCookies.set('current_step', newStep);
    }

    startQuiz = () => {
        this.changeStep(0);
    };

    clickAnswer = (aKey) => {
        this.setState((prevState) => {
            let newStep = prevState.step + 1;
            let completed = false;
            if (newStep === this.questions.order.length) {
                newStep = 0;
                completed = true;
            }
            this.props.editAnswer(
                this.questions.order[prevState.step],
                aKey,
                completed
            );
            SessionCookies.set('current_step', newStep);
            return { step: newStep };
        });
    };

    goBack = () => {
        this.setState((prevState) => {
            let newStep = prevState.step - 1;
            if (newStep < 0) {
                return {};
            } else {
                SessionCookies.set('current_step', newStep);
                return { step: newStep };
            }
        });
    };

    goToStep = (stepNum) => {
        if (stepNum < 0 || stepNum >= this.questions.order.length) {
            return;
        }
        this.changeStep(stepNum);
    };

    cancelQuiz = () => {
        this.changeStep(0);
        this.props.restartQuiz();
    };

    render() {

        // Steps
        let steps = [];
        const stepCount = this.questions.order.length;
        for (let i = 0; i < stepCount; ++i) {
            const qstep = this.questions.order[i];
            let step = {
                title: this.questions.spec[qstep].t,
                target: i,
            };
            if (typeof(this.props.answers[qstep]) !== 'undefined') {
                step.clicked = () => { this.goToStep(i); };
            }
            steps.push(step);
        }

        // Question
        let question = this.questions.order[this.state.step];
        if (typeof question !== 'string') {
            question = this.questions.order[0];
        }
        const qspec = this.questions.spec[question];

        // Answers
        const answerButtons = Object.keys(qspec.a)
            .map((aKey) => {
                let classNames = [ 'AnswerButton' ];
                if (typeof this.props.answers[question] != 'undefined') {
                    if (this.props.answers[question] === aKey) {
                        classNames.push('Selected');
                    }
                }
                return {
                    key: aKey,
                    classNames: classNames,
                    clicked: () => { this.clickAnswer(aKey); },
                    text: qspec.a[aKey]
                };
            });

        // Links
        const links = [
            {
                classNames: [ 'BackLink' ],
                clicked: this.goBack,
                text: 'go back'
            },
            {
                classNames: [ 'RestartLink' ],
                clicked: this.cancelQuiz,
                text: 'restart quiz'
            }
        ];

        return (
            <div className="Quiz">
                <StepCounter
                    steps={steps}
                    currentStep={this.state.step} />
                <Question
                    questionText={qspec.q}
                    helpText={qspec.help} />
                <Controls
                    buttonLayout={qspec.layout}
                    buttons={answerButtons}
                    links={links} />
            </div>
        );
    }

}

export default Quiz;
