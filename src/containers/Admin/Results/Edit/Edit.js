import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import EditMarkdown from '../../../../components/Admin/EditMarkdown/EditMarkdown';
import Form from '../../../../components/Admin/Form/Form';
import Element from '../../../../components/Admin/Form/Element/Element';
import Api from '../../../../storage/Api';
import Language from '../../../../utils/Language';
import Logger from '../../../../utils/Logger';

class AdminResultsEdit extends Component {

    state = {
        loaded: false,
        benefit: null,
        scenario: null,
        error: null,
        processing: false,
        processing_error: null,
        saved: false,
        help: null,
        form: {
            enabled: {
                value: false,
                error: null
            },
            en_result: {
                value: null,
                error: null
            },
            en_expanded: {
                value: null,
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

    changedResult = (e) => {
        let newForm = this.copyForm(this.state.form);
        newForm.en_result.value = e.target.value;
        this.setState({ form: newForm }, () => { this.validate(); });
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
                        let newForm = this.copyForm(prevState.form);
                        newForm.enabled.value = scenario.enabled;
                        newForm.en_result.value = scenario.en_result;
                        newForm.en_expanded.value = scenario.en_expanded;
                        return {
                            loaded: true,
                            benefit: benefit,
                            scenario: scenario,
                            form: newForm,
                            help: this.buildHelp(scenario)
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

    buildHelp(scenario) {
        let allhelp = {};

        const scenarioLines = scenario.help.split("\n").join('<br />');
        allhelp.form = <p dangerouslySetInnerHTML={{__html: scenarioLines}}></p>;

        allhelp.enabled = <p>When this is flag is on, the user will get a response for this scenario.  If we're confident that their employee is not eligible for this benefits, uncheck the box.</p>;

        allhelp.en_result = (
            <Aux>
                <p>This text should be kept very short and should answer the following questions where relevant:</p>
                <ul>
                    <li>What is this benefit?</li>
                    <li>Who pays for it?</li>
                    <li>How do they apply?</li>
                </ul>
            </Aux>
        );

        allhelp.en_expanded = (
            <p>When the user clicks the "read more" button, this is what appears below the main result.  It will be followed by any resource links that have been set for the benefit, and can be collapsed out of view when they click "read less".</p>
        );

        return allhelp;
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

            let i = 0;
            const elements = [];

            // Enabled
            ++i;
            elements.push(
                <Element key={i} add_class="Checkbox"
                    label="Eligibility"
                    help={this.state.help.enabled}
                    error={this.state.form.enabled.error}>
                    <input type="checkbox"
                        name="enabled"
                        checked={this.state.form.enabled.value}
                        onChange={this.clickedEnabled} />
                    <label onClick={this.clickedEnabled}>The employee would be eligible in this scenario</label>
                </Element>
            );

            // Main Result
            if (this.state.form.enabled.value) {
                ++i;
                elements.push(
                    <Element key={i} add_class="Markdown"
                        label="Main Result"
                        help={this.state.help.en_result}
                        error={this.state.form.en_result.error}>
                        <EditMarkdown
                            name="en_result"
                            value={this.state.form.en_result.value}
                            changed={this.changedResult}
                            replace_token="employee_type"
                            replace_options={Language.get_token_options('employee_type')} />
                    </Element>
                );
            }

            // Expanded Result
            if (this.state.form.enabled.value) {
                ++i;
                elements.push(
                    <Element key={i} add_class="Markdown"
                        label="Expanded Info"
                        help={this.state.help.en_expanded}
                        error={this.state.form.en_expanded.error}>
                        <EditMarkdown
                            name="en_expanded"
                            value={this.state.form.en_expanded.value}
                            changed={this.changedExpanded}
                            replace_token="employee_type"
                            replace_options={Language.get_token_options('employee_type')} />
                    </Element>
                );
            }

            body = (
                <Form
                    help={this.state.help.form}
                    success={this.state.saved ? 'The scenario response has been saved' : null}
                    error={this.state.processing_error}
                    valid={this.state.formValid}
                    processing={this.state.processing}
                    submitted={this.submitForm}>
                    {elements}
                </Form>
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
