import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import * as EmailValidator from 'email-validator';

import EditAnswers from './EditAnswers/EditAnswers';
import ContactInfo from '../../../components/BenefitsTool/ContactInfo/ContactInfo';
import Controls from '../../../components/UI/Controls/Controls';
import Api from '../../../storage/Api';

import QuestionsData from '../../../data/questions.json';

class Confirmation extends Component {

    state = {
        loading: false,
        email: '',
        zip: '',
        emailError: false,
        zipError: false,
        saveError: false,
        contactValidOrEmpty: true
    };

    regexValidZip = /^[0-9]{5}(?:-[0-9]{4})?$/;

    changeEmail = (e) => {
        let val = e.target.value;
        this.setState(() => {
            let newstate = { email: val };
            if (val !== '' && !EmailValidator.validate(val)) {
                newstate.emailError = true;
            } else {
                newstate.emailError = false;
            }
            if (val !== '') {
                if (this.state.zip === '') {
                    newstate.zipError = true;
                }
            } else {
                if (this.state.zip === '') {
                    newstate.zipError = false;
                }
            }
            return newstate;
        }, () => this.okToSubmitContact());
    };

    changeZip = (e) => {
        let val = e.target.value;
        this.setState(() => {
            let newstate = { zip: val };
            if (val === '' && this.state.email !== '') {
                newstate.zipError = true;
            } else if (val !== '' && !this.regexValidZip.test(val)) {
                newstate.zipError = true;
            } else {
                newstate.zipError = false;
            }
            return newstate;
        }, () => this.okToSubmitContact());
    };

    confirmAnswers = () => {
        const data = {
            visitor_id: this.props.visitor_id,
            answers: {}
        };
        for (const question of QuestionsData.order) {
            const letter = this.props.answers[question];
            const answer = QuestionsData.spec[question].a[letter];
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
        // TODO: handle error case
        Api.recordResponse(data)
            .then(response => {
                console.log(response);
                this.setState({ loading: false });
                this.props.history.push('/results');
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

        const goto = this.props.needsRedirect();
        if (goto) {
            return <Redirect to={goto} />;
        }

        const buttons = [
            {
                classNames: [ 'ConfirmButton' ],
                clicked: this.confirmAnswers,
                text: 'Confirm'
            }
        ];
        if (this.state.loading || !this.state.contactValidOrEmpty) {
            buttons[0].disabled = true;
        }
        const links = [
            {
                classNames: [ 'RestartLink' ],
                clicked: () => { this.props.history.push('/') },
                text: 'restart quiz'
            }
        ];
        return (
            <div className="Confirmation">
                <EditAnswers
                    answers={this.props.answers}
                    edited={(q, a) => this.props.saveAnswer(q, a)} />
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

export default withRouter(Confirmation);
