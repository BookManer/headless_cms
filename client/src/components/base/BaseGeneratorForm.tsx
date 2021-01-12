import { Button, Col, Row } from 'antd';
import { BaseButtonProps } from 'antd/lib/button/button';
import React, { Fragment } from 'react';
import { FormContext } from '../../contexts/GeneratedForm.context';

// Button Color Schema
/**
 * @interface IButtonCS
 * @member text - Текст для кнопки submit
 */
export interface IButtonCS extends BaseButtonProps {
    text?: string;
}

interface IProps {
    onSubmitForm: (data: object, valid: boolean) => void;
    schema: object;
    submitButton?: IButtonCS
}

export default class BaseGeneratorForm extends React.Component<IProps, any> {
    public fields: Array<any>
    private stokeForm: object = {};

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.handleResetAllFieldsToDefault = this.handleResetAllFieldsToDefault.bind(this);
        this.fields = props.schema.fields;
        this.state = {
            form: {},
            validation: {},
            doShouldReset: false,
            isFormChecked: false,
        }
    }

    componentDidMount() {
        let newState = { form: {}, validation: {} };
        this.fields.forEach(field => {
            newState = {
                form: {
                    ...newState.form,
                    [field.attrs.name]: field.defaultValue,
                },
                validation: {
                    ...newState.validation,
                    [field.attrs.name]: field.validate.every(validator => validator.checkValid(field.defaultValue ? field.defaultValue : "")),
                }
            }
        });
        this.stokeForm = newState.form;
        this.setState({ ...this.state, ...newState });
    }

    handleChangeForm(field: { name: string, value: string, valid: boolean, selectedType?: string }) {
        this.checkDifferencesFormData(field);
        this.setState({
            form: {
                ...this.state.form,
                [field.name]: field.value,
            },
            validation: {
                ...this.state.validation,
                [field.name]: field.valid
            }
        });
    }
    handleSubmit(e: Event) {
        this.setState({ isFormChecked: true });
        this.props.onSubmitForm(this.state.form, this.formValid());
    }
    formValid() {
        const validFormatFields = Object.entries(this.state.validation)
            .map(([key, val]) => (val))
        const hasAllFieldValid = validFormatFields.every(isValid => isValid);

        return hasAllFieldValid && (Object.keys(this.state.validation).length >= this.fields.length);
    }
    handleResetAllFieldsToDefault(e: React.SyntheticEvent) {
        e.stopPropagation();
        e.preventDefault();

        if (this.state.doShouldReset) {
            this.setState({ form: this.stokeForm, doShouldReset: false })
        }
    }
    checkDifferencesFormData(field: { name: string, value: string, valid: boolean }) {
        const { name, value } = field;
        const valueStokeForm = this.stokeForm[name];
        const hasDifference = valueStokeForm !== value;
        this.setState({ doShouldReset: hasDifference });
    }

    render() {
        const fields = this.fields.map((field) => {
            field.isCheckForm = this.state.isFormChecked;
            field = { Component: field.component, ...field.interceptorParams() };
            let { component: Component, ...other } = field;
            other = { ...other, defaultValue: this.state.form[field.attrs.name] }

            return (<Row key={field.name}><Col><Component field={other} emmit={this.handleChangeForm} /></Col></Row>)
        })
        const { text: submitText } = this.props.submitButton;
        return (
            <Fragment>
                <FormContext.Provider value={this.state.form}>
                    {fields}
                </FormContext.Provider>
                <Button type="primary" onClick={(e: any) => { this.handleSubmit(e) }}>{submitText ? submitText : "Подтвердить"}</Button>
                <Button type="text" onClick={this.handleResetAllFieldsToDefault} disabled={!this.state.doShouldReset}>Сбросить изменения</Button>
            </Fragment>
        )
    }
}