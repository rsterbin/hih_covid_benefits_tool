import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import { connect } from 'react-redux';

import EditAnswers from './EditAnswers/EditAnswers';
import ContactInfo from '../../../components/BenefitsTool/ContactInfo/ContactInfo';
import Controls from '../../../components/UI/Controls/Controls';
import Api from '../../../storage/Api';
import Logger from '../../../utils/Logger';
import Language from '../../../utils/Language';
import IdentifierCookie from '../../../storage/cookies/IdentifierCookie';

import Questions from '../../../logic/Questions';

class Confirmation extends Component {

    state = {
        loading: false,
        email: '',
        zip: '',
        emailError: false,
        zipError: false,
        saveError: false,
        contactValidOrEmpty: true,
        hasRecordingError: false
    };

    lang = null;

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
            token: IdentifierCookie.get(),
            visitor_id: this.props.visitor_id,
            answers: Questions.getEnglishAnswers(this.props.answers)
        };
        if (this.state.email.trim() !== '') {
            data.contact = {
                email: this.state.email.trim()
            };
            if (this.state.zip.trim() !== '') {
                data.contact.zip = this.state.zip.trim();
            }
        }
        this.setState({ loading: true });
        Api.recordResponse(data)
            .then(response => {
                IdentifierCookie.remove();
                this.setState({ loading: false });
                this.props.history.push('/results');
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    throw error;
                }
                // This is an alert-level error for me the programmer, but not
                // for the user -- if the API is malfunctioning, let's give it
                // one chance to get over a hiccup, then send them on to the
                // results page without recording anything
                Logger.alert('Could not record response', { api_error: Api.parseAxiosError(error) });
                this.setState((current) => {
                    if (this.state.hasRecordingError) {
                        IdentifierCookie.remove();
                        this.props.history.push('/results');
                        return { loading: false, hasRecordingError: false };
                    } else {
                        return { loading: false, hasRecordingError: true };
                    }
                });
            });
    };

    componentDidMount() {
        Logger.setComponent('BenefitsTool/Confirmation');
        Api.bumpSession(this.props.visitor_id);
    }

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
        Logger.setComponent('BenefitsTool/Confirmation');

        const lang = {
            edit_answers: {
                header: Language.get('confirm_answerlist_header'),
                cancel_title: Language.get('confirm_answerlist_cancel_edit_link_title'),
                cancel_alt: Language.get('util_cancel_alt_text'),
                edit_title: Language.get('confirm_answerlist_edit_link_title'),
                edit_alt: Language.get('confirm_answerlist_edit_link_title'),
            },
            contact: {
                header: Language.get('confirm_contact_header'),
                invitation: Language.get('confirm_contact_invitation'),
                email_label: Language.get('confirm_contact_email_label'),
                email_error: Language.get('confirm_contact_email_error'),
                zip_label: Language.get('confirm_contact_zip_label'),
                zip_error: Language.get('confirm_contact_zip_error')
            },
            controls: {
                confirm_button: Language.get('confirm_button_text'),
                restart_link: Language.get('confirm_restart_link_text'),
                recording_error: Language.get('confirm_recording_error')
            }
        };

        const step = Questions.firstMissingStep(this.props.answers);
        if (step !== null) {
            const goto = step < 1 ? '/' : '/quiz/' + step;
            return <Redirect to={goto} />;
        }

        const buttons = [
            {
                classNames: [ 'ConfirmButton' ],
                clicked: this.confirmAnswers,
                text: lang.controls.confirm_button
            }
        ];
        if (this.state.loading || !this.state.contactValidOrEmpty) {
            buttons[0].disabled = true;
        }
        const links = [
            {
                classNames: [ 'RestartLink' ],
                clicked: () => { this.props.history.push('/') },
                text: lang.controls.restart_link
            }
        ];

        return (
            <div className="Confirmation">
                <EditAnswers lang={lang.edit_answers} />
                <ContactInfo
                    emailError={this.state.emailError}
                    zipError={this.state.zipError}
                    email={this.state.email}
                    zip={this.state.zip}
                    emailChanged={this.changeEmail}
                    zipChanged={this.changeZip}
                    lang={lang.contact} />
                <Controls
                    errorMessage={this.state.hasRecordingError ? lang.controls.recording_error : null}
                    buttons={buttons}
                    links={links} />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        visitor_id: state.visitor_id,
        answers: state.answers
    };
};

export default connect(mapStateToProps)(withRouter(Confirmation));
