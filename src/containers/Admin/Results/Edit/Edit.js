import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import EditMarkdown from '../../../../components/Admin/EditMarkdown/EditMarkdown';
import ProcessingButton from '../../../../components/UI/ProcessingButton/ProcessingButton';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

import './Edit.css';

class AdminResultsEdit extends Component {

    state = {
        loaded: false,
        benefit: null,
        scenario: null,
        error: null,
        processing: false,
        processing_error: null,
        saved: false,
        form: {
            enabled: {
                value: false,
                error: null
            },
            en_result: {
                value: null,
                view: 'edit',
                error: null
            },
            en_expanded: {
                value: null,
                view: 'edit',
                error: null
            }
        },
        formValid: true
    };

    refresh = () => {
        this.fetchScenario();
    };

    submitForm = (e) => {
        e.preventDefault();
        this.setState({
            processing: true,
            processing_error: null,
            saved: false
        });
        const data = {
            token: this.props.token,
            enabled: this.state.form.enabled.value,
            en_result: this.state.form.en_result.value,
            en_expanded: this.state.form.en_expanded.value
        };
        Api.saveScenario(
                this.props.match.params.benefit,
                this.props.match.params.id,
                data
            )
            .then((response) => {
                this.setState({
                    processing: false,
                    processing_error: false,
                    saved: true
                });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not save scenario', { api_error: Api.parseAxiosError(error), benefit: this.props.match.params.benefit, scenario_id: this.props.match.params.id });
                this.setState({
                    processing: false,
                    processing_error: 'Could not save scenario'
                });
            });
    };

    clickedEnabled = (e) => {
        e.stopPropagation();
        this.setState(prevState => {
            let newForm = this.copyForm(prevState.form);
            newForm.enabled.value = !prevState.form.enabled.value;
            return { form: newForm };
        }, () => { this.validate(); });
    };

    doEditResult = () => {
        let newForm = this.copyForm(this.state.form);
        newForm.en_result.view = 'edit';
        this.setState({ form: newForm });
    };

    doPreviewResult = () => {
        let newForm = this.copyForm(this.state.form);
        newForm.en_result.view = 'preview';
        this.setState({ form: newForm });
    };

    changedResult = (e) => {
        let newForm = this.copyForm(this.state.form);
        newForm.en_result.value = e.target.value;
        this.setState({ form: newForm }, () => { this.validate(); });
    };

    doEditExpanded = () => {
        let newForm = this.copyForm(this.state.form);
        newForm.en_expanded.view = 'edit';
        this.setState({ form: newForm });
    };

    doPreviewExpanded = () => {
        let newForm = this.copyForm(this.state.form);
        newForm.en_expanded.view = 'preview';
        this.setState({ form: newForm });
    };

    changedExpanded = (e) => {
        let newForm = this.copyForm(this.state.form);
        newForm.en_expanded.value = e.target.value;
        this.setState({ form: newForm }, () => { this.validate(); });
    };

    componentDidMount() {
        this.fetchScenario();
    }

    fetchScenario() {
        this.setState({
            loaded: false,
            benefit: null,
            scenario: null,
            error: null
        });
        const data = { token: this.props.token };
        Api.getScenario(
                this.props.match.params.benefit,
                this.props.match.params.id,
                data
            )
            .then((response) => {
                if (!response.data.benefit || !response.data.scenario) {
                    this.setState({ error: 'That scenario is unknown' });
                } else {
                    const benefit = response.data.benefit;
                    const scenario = response.data.scenario;
                    this.setState(prevState => {
                        let newForm = {
                            enabled: { ...prevState.form.enabled },
                            en_result: { ...prevState.form.en_result },
                            en_expanded: { ...prevState.form.en_expanded },
                        };
                        newForm.enabled.value = scenario.enabled;
                        newForm.en_result.value = scenario.en_result;
                        newForm.en_expanded.value = scenario.en_expanded;
                        return {
                            loaded: true,
                            benefit: benefit,
                            scenario: scenario,
                            form: newForm
                        };
                    }, () => { this.validate(); });
                }
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch scenario', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch scenario' });
            });
    }

    copyForm(form) {
        let newForm = {};
        for (const k in form) {
            newForm[k] = { ...form[k] };
        }
        return newForm;
    }

    validate() {
        let newForm = this.copyForm(this.state.form);
        newForm.enabled.error = null;
        newForm.en_result.error = null;
        newForm.en_expanded.error = null;
        let formValid = true;
        if (this.state.form.enabled.value) {
            const result = this.state.form.en_result.value;
            if (!result || result.trim().length < 1) {
                newForm.en_result.error = 'Please enter some text for the response';
                formValid = false;
            }
        }
        this.setState({ form: newForm, formValid: formValid });
    }

    render() {
        let body = null;
        let title = 'Results: ';
        let crumbs = ['Admin', 'Results'];

        if (this.state.loaded) {
            title += this.state.benefit.abbreviation + ': Edit Scenario';
            crumbs.push(this.state.benefit.abbreviation);
            crumbs.push('Scenario');

            const help = this.state.scenario.help.split("\n").join('<br />');
            body = (
                <Aux>
                    <div className="FormHeader">
                        <div className="HelpBox" dangerouslySetInnerHTML={{__html: help}} />
                    </div>
                    <form method="post" onSubmit={this.submitForm}>
                        <div className="CheckboxElement">
                            {this.state.form.enabled.error ?
                                <p className="Error">{this.state.form.enabled.error}</p>
                            : null}
                            <input type="checkbox" name="enabled" checked={this.state.form.enabled.value} onChange={this.clickedEnabled} />
                            <label onClick={this.clickedEnabled}>Eligible?</label>
                        </div>

                        {this.state.form.enabled.value ?
                        <div className="TexareaElement">
                            <label>Result (Short)</label>
                            {this.state.form.en_result.error ?
                                <p className="Error">{this.state.form.en_result.error}</p>
                            : null}
                            <EditMarkdown
                                name="en_result"
                                previewing={this.state.form.en_result.view === 'preview'}
                                value={this.state.form.en_result.value}
                                clickedEdit={this.doEditResult}
                                clickedPreview={this.doPreviewResult}
                                changed={this.changedResult} />
                        </div>
                        : null}

                        {this.state.form.enabled.value ?
                        <div className="TexareaElement">
                            <label>Result (Expanded)</label>
                            {this.state.form.en_expanded.error ?
                                <p className="Error">{this.state.form.en_expanded.error}</p>
                            : null}
                            <EditMarkdown
                                name="en_expanded"
                                previewing={this.state.form.en_expanded.view === 'preview'}
                                value={this.state.form.en_expanded.value}
                                clickedEdit={this.doEditExpanded}
                                clickedPreview={this.doPreviewExpanded}
                                changed={this.changedExpanded} />
                        </div>
                        : null}

                        <div className="ButtonHolder">
                            <ProcessingButton
                                disabled={!this.state.formValid}
                                working={this.state.processing}
                                clicked={this.submitForm}
                                text="Submit" />
                        </div>

                        {this.state.saved ?
                            <Message type="success" text="The scenario response has been saved" />
                        : null}
                        {this.state.processing_error ?
                            <Message type="error" text={this.state.processing_error} />
                        : null}
                    </form>
                </Aux>
            );

        } else {
            title += 'Edit Scenario';
            crumbs.push('Scenario');

            body = (
                <Aux>
                    {this.state.error ?
                        <Message type="error" text={this.state.error} tryagain={this.refresh} />
                    : null}
                    <Spinner />
                </Aux>
            );
        }

        return (
            <AdminPage title={title} breadcrumbs={crumbs}>
                {body}
            </AdminPage>
        );
    }

}

export default withRouter(AdminResultsEdit);
