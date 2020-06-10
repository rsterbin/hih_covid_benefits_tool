import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Form from '../../../../components/Admin/Form/Form';
import Element from '../../../../components/Admin/Form/Element/Element';
import EditMarkdown from '../../../../components/Admin/EditMarkdown/EditMarkdown';
import Api from '../../../../storage/Api';
import Language from '../../../../utils/Language';
import Logger from '../../../../utils/Logger';

// TODO: new resource button on the resources list page that respects the current benefit
// TODO: delete resource option

class AdminResourcesEdit extends Component {

    state = {
        loaded: false,
        resource: null,
        reload_id: null,
        all_benefits: [],
        error: null,
        form: {
            benefit_id: {
                value: null,
                error: null
            },
            link_en: {
                value: null,
                error: null
            },
            en_text: {
                value: null,
                error: null
            },
            en_desc: {
                value: null,
                error: null
            }
        },
        formValid: true,
        saved: false,
        processing_error: null,
        processing: false
    };

    help = {
        benefit_id: <p>The benefit associated with this resource</p>,
        link_en: <p>The link to this resource</p>,
        en_text: <p>The text for the link</p>,
        en_desc: <p>Any description that should be shown below the link (optional)</p>
    };

    changedBenefitID = (e) => {
        let newForm = this.copyForm(this.state.form);
        newForm.benefit_id.value = e.target.value;
        this.setState({ form: newForm }, () => { this.validate(); });
    };

    changedLink = (e) => {
        let newForm = this.copyForm(this.state.form);
        newForm.link_en.value = e.target.value;
        this.setState({ form: newForm }, () => { this.validate(); });
    };

    changedText = (e) => {
        let newForm = this.copyForm(this.state.form);
        newForm.en_text.value = e.target.value;
        this.setState({ form: newForm }, () => { this.validate(); });
    };

    changedDescription = (e) => {
        let newForm = this.copyForm(this.state.form);
        newForm.en_desc.value = e.target.value;
        this.setState({ form: newForm }, () => { this.validate(); });
    };

    submitForm = (e) => {
        e.preventDefault();
        this.setState({
            processing: true,
            processing_error: null,
            saved: false
        });
        let info = {};
        if (this.state.resource) {
            info.id = this.state.resource.id;
            info.code = this.state.resource.code;
            info.lang_key_text = this.state.resource.lang_key_text;
            info.lang_key_desc = this.state.resource.lang_key_desc;
        }
        info.benefit = null;
        if (this.state.form.benefit_id.value) {
            for (var b of this.state.all_benefits) {
                if (b.id === this.state.form.benefit_id.value) {
                    info.benefit = { ...b };
                }
            }
        }
        info.en_text = this.state.form.en_text.value;
        info.en_desc = this.state.form.en_desc.value;
        info.links = { en: this.state.form.link_en.value };
        Api.saveResource({
                token: this.props.token,
                info: info
            })
            .then((response) => {
                let doNext = null;
                if (!info.id) {
                    doNext = () => {
                        if (response.data.id) {
                            this.props.history.push('/admin/resources/edit/' + response.data.id);
                            this.setState({ reload_id: response.data.id }, () => { this.fetchResource(); });
                        }
                    };
                }
                this.setState({
                    processing: false,
                    processing_error: false,
                    saved: true
                }, doNext);
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not save resource', { api_error: Api.parseAxiosError(error), info: info });
                this.setState({
                    processing: false,
                    processing_error: 'Could not save resource'
                });
            });
    };

    refresh = () => {
        if (this.getId()) {
            this.fetchResource(true);
        } else {
            this.fetchBenefits();
        }
    };

    componentDidMount() {
        if (this.getId()) {
            this.fetchResource(true);
        } else {
            this.fetchBenefits();
        }
    }

    fetchResource(fetch_all) {
        this.setState({ loaded: false, resource: null, error: null });
        const data = { token: this.props.token };
        Api.getResource(this.getId(), data)
            .then((response) => {
                const resource = response.data.resource;
                if (fetch_all) {
                    this.refreshForm(resource);
                    this.fetchBenefits();
                } else {
                    this.refreshForm(resource, true);
                }
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch resource', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch resource' });
            });
    }

    fetchBenefits() {
        this.setState({ loaded: false, all_benefits: null, error: null });
        const data = { token: this.props.token };
        Api.getBenefits(data)
            .then((response) => {
                const benefits = response.data.benefits ? response.data.benefits : [];
                this.setState((prevState) => {
                    let newState = { loaded: true, all_benefits: benefits };
                    let benefit_id = null;
                    if (this.props.match.params.benefit) {
                        for (const b of newState.all_benefits) {
                            if (this.props.match.params.benefit === b.code) {
                                benefit_id = b.id;
                            }
                        }
                    }
                    if (benefit_id !== null) {
                        let newForm = this.copyForm(prevState.form);
                        newForm.benefit_id.value = benefit_id;
                        newState.form = newForm;
                    }
                    return newState;
                });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch benefits', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch benefits' });
            });
    }

    refreshForm(resource, markLoaded) {
        this.setState(prevState => {
            let newForm = this.copyForm(prevState.form);
            newForm.benefit_id.value = resource.benefit ? resource.benefit.id : null;
            newForm.link_en.value = resource.links.en;
            newForm.en_text.value = resource.en_text;
            newForm.en_desc.value = resource.en_desc;
            let newState = {
                resource: resource,
                form: newForm
            };
            if (markLoaded) {
                newState.loaded = true;
            }
            return newState;
        }, () => { this.validate(); });
    }

    copyForm(form) {
        let newForm = {};
        for (const k in form) {
            newForm[k] = { ...form[k] };
        }
        return newForm;
    }

    validate() {
        let oldForm = this.state.form;
        let newForm = this.copyForm(oldForm);
        for (const k in newForm) {
            newForm[k].error = null;
        }
        let ok = true;
        if (!oldForm.link_en.value ||
            oldForm.link_en.value.trim().length < 1) {
            newForm.link_en.error = 'Please enter a link to this resource';
        }
        if (!oldForm.en_text.value ||
            oldForm.en_text.value.trim().length < 1) {
            newForm.en_text.error = 'Please enter the text used to link to this resource';
        }
        this.setState({ formValid: ok, form: newForm });
    }

    getId() {
        if (this.props.match.params.id) {
            return this.props.match.params.id;
        } else if (this.state.reload_id !== null) {
            return this.state.reload_id;
        } else {
            return null;
        }
    }

    render() {

        let body = null;
        let title = 'Resources: Edit';
        let crumbs = ['Admin', 'Resources'];

        if (this.state.loaded) {
            let elements = [];
            let i = 0;

            if (this.state.resource === null) {
                title = 'Resources: New';
            }

            // Benefit
            ++i;
            let options = this.state.all_benefits.map(benefit => {
                return (
                    <option key={benefit.id} value={benefit.id}>{benefit.abbreviation}</option>
                );
            });
            options.unshift(<option key="common" value="">Common</option>);
            elements.push(
                <Element key={i} add_class="Select"
                    label="Associated Benefit"
                    help={this.help.benefit_id}
                    error={this.state.form.benefit_id.error}>
                    <select name="benefit_id"
                        value={this.state.form.benefit_id.value || ''}
                        onChange={this.changedBenefitID}>
                        {options}
                    </select>
                </Element>
            );

            // Link
            ++i;
            elements.push(
                <Element key={i} add_class="Text"
                    label="URL"
                    help={this.help.link_en}
                    error={this.state.form.link_en.error}>
                    <input type="text" name="link_en" size="80"
                        value={this.state.form.link_en.value || ''}
                        onChange={this.changedLink} />
                </Element>
            );

            // Main Text
            ++i;
            elements.push(
                <Element key={i} add_class="Text"
                    label="Text"
                    help={this.help.en_text}
                    error={this.state.form.en_text.error}>
                    <input type="text" name="en_text" size="80"
                        value={this.state.form.en_text.value || ''}
                        onChange={this.changedText} />
                </Element>
            );

            // Description
            ++i;
            elements.push(
                <Element key={i} add_class="Text"
                    label="Description"
                    help={this.help.en_desc}
                    error={this.state.form.en_desc.error}>
                    <EditMarkdown
                        name="en_result"
                        value={this.state.form.en_desc.value}
                        changed={this.changedDescription}
                        replace_token="employee_type"
                        replace_options={Language.get_token_options('employee_type')} />
                </Element>
            );

            body = (
                <Form
                    success={this.state.saved ? 'The resource has been saved' : null}
                    error={this.state.processing_error}
                    valid={this.state.formValid}
                    processing={this.state.processing}
                    submitted={this.submitForm}>
                    {elements}
                </Form>
            );
        } else {
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

export default withRouter(AdminResourcesEdit);
