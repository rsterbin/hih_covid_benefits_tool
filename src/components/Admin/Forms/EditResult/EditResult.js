import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import Form from '../../Form/Form';
import Element from '../../Form/Element/Element';
import Aux from '../../../../hoc/Aux/Aux';
import EditMarkdown from '../../EditMarkdown/EditMarkdown';
import Language from '../../../../utils/Language';

// props:
// * processing
// * saved
// * submitAction
// * scenario
// * prefill

const FormEditResult = (props) => {

    const fhooks = useForm({ mode: 'onBlur' });
    const valid = Object.keys(fhooks.errors).length < 1;
    const isEnabled = fhooks.watch('enabled', props.prefill.enabled);

    let help = {
        form: <p dangerouslySetInnerHTML={{__html: props.scenario.help.split("\n").join('<br />')}}></p>,
        enabled: <p>When this is flag is on, the user will get a response for this scenario.  If we're confident that their employee is not eligible for this benefits, uncheck the box.</p>,
        en_result: (
            <Aux>
                <p>This text should be kept very short and should answer the following questions where relevant:</p>
                <ul>
                    <li>What is this benefit?</li>
                    <li>Who pays for it?</li>
                    <li>How do they apply?</li>
                </ul>
            </Aux>
        ),
        en_expanded: (
            <p>When the user clicks the "read more" button, this is what appears below the main result.  It will be followed by any resource links that have been set for the benefit, and can be collapsed out of view when they click "read less".</p>
        )
    };

    return (
        <Form
            success={props.saved ? 'The resource has been saved' : null}
            valid={valid}
            error={valid ? null : 'Please correct the errors below'}
            help={help.form}
            processing={props.processing}
            onCloseMsg={props.onCloseMsg}
            submitted={fhooks.handleSubmit(props.submitAction)}>

            <Element key="enabled" add_class="Checkbox"
                label="Eligibility"
                help={help.enabled}>
                <label>
                    <input type="checkbox"
                        name="enabled"
                        defaultChecked={props.prefill.enabled}
                        ref={fhooks.register} />
                     The employee would be eligible in this scenario
                 </label>
            </Element>

            {isEnabled && (
                <Controller
                    name="en_result"
                    control={fhooks.control}
                    defaultValue={props.prefill.en_result || ''}
                    rules={{ required: 'Please enter some text for the response' }}
                    render={cprops => {
                        return <Element key="en_result" add_class="Markdown"
                            label="Main Result"
                            help={help.en_result}
                            error={fhooks.errors.en_result ? fhooks.errors.en_result.message : null}>
                            <EditMarkdown
                                name="en_result"
                                value={cprops.value}
                                changed={cprops.onChange}
                                replace_token="employee_type"
                                replace_options={Language.get_token_options('employee_type')} />
                        </Element>
                    }} />
            )}

            {isEnabled && (
                <Controller
                    name="en_expanded"
                    control={fhooks.control}
                    defaultValue={props.prefill.en_expanded || ''}
                    render={cprops => {
                        return <Element key="en_expanded" add_class="Markdown"
                            label="Expanded Info"
                            help={help.en_expanded}
                            error={fhooks.errors.en_expanded ? fhooks.errors.en_expanded.message : null}>
                            <EditMarkdown
                                name="en_expanded"
                                value={cprops.value}
                                changed={cprops.onChange}
                                replace_token="employee_type"
                                replace_options={Language.get_token_options('employee_type')} />
                        </Element>
                    }} />
            )}

        </Form>
    );
};

export default FormEditResult;
