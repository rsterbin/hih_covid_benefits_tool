import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import StepCounter from '../../../components/BenefitsTool/StepCounter/StepCounter';
import Question from '../../../components/BenefitsTool/Question/Question';
import Controls from '../../../components/UI/Controls/Controls';
import Logger from '../../../utils/Logger';
import Language from '../../../utils/Language';
import Api from '../../../storage/Api';
import * as actions from '../../../storage/redux/actions/index';

import Questions from '../../../logic/Questions';

class Quiz extends Component {

    clickAnswer = (letter) => {
        const qcode = Questions.getCodeByStep(this.currentStep());
        this.props.saveAnswer(qcode, letter);
    };

    goBack = () => {
        // NB: the urls are 1-indexed, so the current step in 0-index form is
        // actually back by one
        let newStep = this.currentUrlStep() - 1;
        if (newStep < 1) {
            newStep = 0;
            Logger.err('Request to go back before step 1');
        }
        this.props.history.push('/quiz/' + newStep);
    };

    goToStep = (stepNum) => {
        if (stepNum < 1 || stepNum > Questions.count()) {
            Logger.warn('Event request to go to an out-of-bounds step', { step: stepNum });
            return;
        }
        this.props.history.push('/quiz/' + stepNum);
    };

    cancelQuiz = () => {
        this.props.history.push('/');
    };

    restartQuiz = () => {
        this.props.history.push('/quiz/1');
    };

    componentDidMount() {
        Api.bumpSession(this.props.visitor_id);
    }

    currentStep() {
        let current = 0;
        if (this.props.match.params.step) {
            let test = parseInt(this.props.match.params.step);
            if (!isNaN(test) && test > 0 && test <= Questions.count()) {
                current = test - 1;
            } else {
                Logger.warn('URL request to go to an out-of-bounds step', { step: this.props.match.params.step });
            }
        }
        return current;
    }

    currentUrlStep() {
        return this.currentStep() + 1;
    }

    render() {

        const lang = {
            error_message: Language.get('quiz_save_failed_error'),
            back_link_text: Language.get('quiz_back_link_text'),
            restart_link_text: Language.get('util_restart_link_text'),
            cancel_link_text: Language.get('quiz_cancel_link_text'),
        };

        // Steps
        let steps = [];
        const stepCount = Questions.count();
        for (let i = 0; i < stepCount; ++i) {
            const qcode = Questions.getCodeByStep(i);
            const qspec = Questions.getLocalSpec(qcode);
            let step = {
                title: qspec.title,
                target: i,
            };
            if (typeof(this.props.answers[qcode]) !== 'undefined') {
                step.clicked = () => { this.goToStep(i + 1); };
            }
            steps.push(step);
        }

        // Question
        let qcode = Questions.getCodeByStep(this.currentStep());
        if (typeof qcode !== 'string') {
            qcode = Questions.getCodeByStep(0);
        }
        const qspec = Questions.getLocalSpec(qcode);

        // Answers
        const answerButtons = Object.keys(qspec.answers).sort()
            .map((aKey) => {
                let classNames = [ 'AnswerButton' ];
                if (typeof this.props.answers[qcode] != 'undefined') {
                    if (this.props.answers[qcode] === aKey) {
                        classNames.push('Selected');
                    }
                }
                return {
                    key: aKey,
                    classNames: classNames,
                    clicked: () => { this.clickAnswer(aKey); },
                    text: qspec.answers[aKey]
                };
            });

        // Links
        let links = [];
        if (this.currentStep() > 0) {
            links.push({
                classNames: [ 'BackLink' ],
                clicked: this.goBack,
                text: lang.back_link_text
            });
            links.push({
                classNames: [ 'RestartLink' ],
                clicked: this.restartQuiz,
                text: lang.restart_link_text
            });
        } else {
            links.push({
                classNames: [ 'CancelLink' ],
                clicked: this.cancelQuiz,
                text: lang.cancel_link_text
            });
        }

        let message = null;
        if (this.props.has_error) {
            message = lang.error_message;
        }

        let redirect = null;
        if (this.props.step_saved) {
            if (this.currentStep() + 1 >= Questions.count()) {
                redirect = <Redirect push to="/confirm" />;
            } else {
                const newStep = this.currentUrlStep() + 1;
                const newPath = '/quiz/' + newStep;
                redirect = <Redirect push to={newPath} />;
            }
            this.props.initQuestion();
        }

        return (
            <div className="Quiz">
                {redirect}
                <StepCounter
                    steps={steps}
                    currentStep={this.currentStep()} />
                <Question
                    questionText={qspec.question}
                    helpText={qspec.help} />
                <Controls
                    errorMessage={message}
                    buttonLayout={qspec.layout}
                    buttons={answerButtons}
                    links={links} />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        visitor_id: state.visitor_id,
        answers: state.answers,
        has_error: state.answers_push_error,
        step_saved: state.step_saved
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initQuestion: (step) => dispatch(actions.questionInit(step)),
        saveAnswer: (qcode, letter) => dispatch(actions.answerPush(qcode, letter))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Quiz));
