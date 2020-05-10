import React, { Component } from 'react';
import * as EmailValidator from 'email-validator';

import AnswerList from '../../../components/BenefitsTool/AnswerList/AnswerList';
import ContactInfo from '../../../components/BenefitsTool/ContactInfo/ContactInfo';
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
        saveError: false,
        contactValidOrEmpty: false
    };

    regexValidZip = /^[0-9]{5}(?:-[0-9]{4})?$/;

    questions = QuestionsData;

    changeEmail = (e) => {
        let val = e.target.value;
        let newstate = { email: val };
        if (val !== '' && !EmailValidator.validate(val)) {
            newstate.emailError = true;
        } else {
            newstate.emailError = false;
        }
        this.setState(newstate, () => this.okToSubmitContact());
    };

    changeZip = (e) => {
        let val = e.target.value;
        let newstate = { zip: val };
        if (val !== '' && !this.regexValidZip.test(val)) {
            newstate.zipError = true;
        } else {
            newstate.zipError = false;
        }
        this.setState(newstate, () => this.okToSubmitContact());
    };

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
        if (this.state.email.trim() !== '') {
            data.contact = {
                email: this.state.email.trim()
            };
            if (this.state.zip.trim() !== '') {
                data.contact.zip = this.state.zip.trim();
            }
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

    okToSubmitContact() {
        let validOrEmpty = null;
        if (this.state.email === '' && this.state.zip === '') {
            validOrEmpty = true;
        } else if (this.state.email === '' || this.state.zip === '') {
            validOrEmpty = false;
        } else {
            if (this.state.emailError || this.state.zipError) {
                validOrEmpty = false;
            } else {
                validOrEmpty = true;
            }
        }
        this.setState({ contactValidOrEmpty: validOrEmpty });
    }

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
                <ContactInfo
                    emailError={this.state.emailError}
                    zipError={this.state.zipError}
                    email={this.state.email}
                    zip={this.state.zip}
                    emailChanged={this.changeEmail}
                    zipChanged={this.changeZip}
                    />
                <Controls
                    buttons={buttons}
                    links={links} />
            </div>
        );
    }

}

export default Confirmation;
