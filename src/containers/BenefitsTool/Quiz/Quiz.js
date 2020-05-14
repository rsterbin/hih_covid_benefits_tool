import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import StepCounter from '../../../components/BenefitsTool/StepCounter/StepCounter';
import Question from '../../../components/BenefitsTool/Question/Question';
import Controls from '../../../components/UI/Controls/Controls';

import QuestionsData from '../../../data/questions.json';

// TODO: Switch to routing for question steps

class Quiz extends Component {

    clickAnswer = (letter) => {
        const qcode = QuestionsData.order[this.currentStep()];
        const ok = this.props.saveAnswer(qcode, letter);
        if (ok) {
            if (this.currentStep() + 1 >= QuestionsData.order.length) {
                this.props.history.push('/confirm');
            } else {
                const newStep = this.currentUrlStep() + 1;
                this.props.history.push('/quiz/' + newStep);
            }
        } else {
            // TODO: error
            console.log('Could not save question ' + qcode + ' with answer ' + letter);
        }
    };

    goBack = () => {
        // NB: the urls are 1-indexed, so the current step in 0-index form is
        // actually back by one
        let newStep = this.currentUrlStep() - 1;
        if (newStep < 1) {
            newStep = 0;
            // TODO: error
            console.log('Request to go back before step 1');
        }
        this.props.history.push('/quiz/' + newStep);
    };

    goToStep = (stepNum) => {
        if (stepNum < 1 || stepNum > QuestionsData.order.length) {
            return;
        }
        this.props.history.push('/quiz/' + stepNum);
    };

    cancelQuiz = () => {
        this.props.clearAnswers();
        this.props.history.push('/');
    };

    restartQuiz = () => {
        this.props.history.push('/quiz/1');
    };

    currentStep() {
        let current = 0;
        if (this.props.match.params.step) {
            let test = parseInt(this.props.match.params.step);
            if (!isNaN(test) && test > 0 && test <= QuestionsData.order.length) {
                current = test - 1;
            }
        }
        return current;
    }

    currentUrlStep() {
        return this.currentStep() + 1;
    }

    render() {

        // Steps
        let steps = [];
        const stepCount = QuestionsData.order.length;
        for (let i = 0; i < stepCount; ++i) {
            const qstep = QuestionsData.order[i];
            let step = {
                title: QuestionsData.spec[qstep].t,
                target: i,
            };
            if (typeof(this.props.answers[qstep]) !== 'undefined') {
                step.clicked = () => { this.goToStep(i + 1); };
            }
            steps.push(step);
        }

        // Question
        let question = QuestionsData.order[this.currentStep()];
        if (typeof question !== 'string') {
            question = QuestionsData.order[0];
        }
        const qspec = QuestionsData.spec[question];

        // Answers
        const answerButtons = Object.keys(qspec.a).sort()
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
                    currentStep={this.currentStep()} />
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

export default withRouter(Quiz);
