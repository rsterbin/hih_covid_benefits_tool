import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import Form from '../../Form/Form';
import Element from '../../Form/Element/Element';
import EditMarkdown from '../../EditMarkdown/EditMarkdown';
import Language from '../../../../utils/Language';

// props:
// * processing
// * saved
// * submitAction
// * benefits
// * prefill (optional)

const FormEditResource = (props) => {

    const fhooks = useForm({ mode: 'onBlur' });
    const valid = Object.keys(fhooks.errors).length < 1;

    const help = {
        benefit_id: <p>The benefit associated with this resource</p>,
        link_en: <p>The link to this resource</p>,
        en_text: <p>The text for the link</p>,
        en_desc: <p>Any description that should be shown below the link (optional)</p>
    };

    // Options for the associated benefit select
    let benefit_options = props.benefits.map(benefit => {
        return (
            <option key={benefit.id} value={benefit.id}>{benefit.abbreviation}</option>
        );
    });
    benefit_options.unshift(<option key="common" value="">Common</option>);

    return (
        <Form
            success={props.saved ? 'The resource has been saved' : null}
            valid={valid}
            error={valid ? null : 'Please correct the errors below'}
            processing={props.processing}
            onCloseMsg={props.onCloseMsg}
            submitted={fhooks.handleSubmit(props.submitAction)}>

            <Element key="benefit_id" add_class="Select"
                label="Associated Benefit"
                help={help.benefit_id}>
                <select name="benefit_id" defaultValue={props.prefill.benefit_id || ''} ref={fhooks.register}>
                    {benefit_options}
                </select>
            </Element>

            <Element key="link_en" add_class="Text"
                label="URL"
                help={help.link_en}
                error={fhooks.errors.link_en ? fhooks.errors.link_en.message : null}>
                <input type="text" name="link_en" size="80"
                    defaultValue={props.prefill.link_en || ''}
                    ref={fhooks.register({required: 'Please enter a link to this resource'})} />
            </Element>

            <Element key="en_text" add_class="Text"
                label="Text"
                help={help.en_text}
                error={fhooks.errors.en_text ? fhooks.errors.en_text.message : null}>
                <input type="text" name="en_text" size="80"
                    defaultValue={props.prefill.en_text || ''}
                    ref={fhooks.register({required: 'Please enter the text used to link to this resource'})} />
            </Element>

            <Controller
                name="en_desc"
                control={fhooks.control}
                defaultValue={props.prefill.en_desc || ''}
                render={cprops => {
                    return <Element key="en_result" add_class="Text"
                        label="Description"
                        help={help.en_desc}
                        error={fhooks.errors.en_desc ? fhooks.errors.en_desc.message : null}>
                        <EditMarkdown
                            name="en_result"
                            value={cprops.value}
                            changed={cprops.onChange}
                            replace_token="employee_type"
                            replace_options={Language.get_token_options('employee_type')} />
                    </Element>
                }} />

        </Form>
    );
};

export default FormEditResource;
