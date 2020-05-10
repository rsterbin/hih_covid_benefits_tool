import React, { Component } from 'react';

import AnswerList from '../../../components/BenefitsTool/AnswerList/AnswerList';
import Controls from '../../../components/UI/Controls/Controls';
import Api from '../../../utils/Api';

import QuestionsData from '../../../data/questions.json';

class Confirmation extends Component {

    state = {
        loading: false,
        email: '',
        zip: '',
        emailError: false,
        zipError: false,
        saveError: false
    };

    questions = QuestionsData;

    confirmAnswers = () => {
        const data = {
            visitor_id: this.props.visitor_id,
            answers: {}
        };
        for (const question of this.questions.order) {
            const letter = this.props.answers[question];
            const answer = this.questions.spec[question].a[letter];
            data.answers[question] = answer.toUpperCase();
        }
        this.setState({ loading: true });
        // TODO: Add email and zip intake
        // TODO: Add response editing
        Api.recordResponse(data)
            .then(response => {
                console.log(response);
                this.setState({ loading: false });
                this.props.confirmAnswers();
            })
            .catch(error => {
                // We probably just want to continue if this is a disaster?
                this.setState({ loading: false });
                console.log(error);
            });
    };

    render() {
        const buttons = [
            {
                classNames: [ 'ConfirmButton' ],
                clicked: this.confirmAnswers,
                text: 'Confirm'
            }
        ];
        if (this.state.loading) {
            buttons[0].disabled = true;
        }
        const links = [
            {
                classNames: [ 'RestartLink' ],
                clicked: this.props.restartQuiz,
                text: 'restart quiz'
            }
        ];
        return (
            <div className="Confirmation">
                <AnswerList
                    questions={this.questions}
                    answers={this.props.answers}
                    edited={(q, a) => this.props.editAnswer(q, a)} />
                <Controls
                    buttons={buttons}
                    links={links} />
            </div>
        );
    }

}

export default Confirmation;
