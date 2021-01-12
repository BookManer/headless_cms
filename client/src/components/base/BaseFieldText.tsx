import { Input } from 'antd';
import React from 'react';
import Message from '../Message';

interface BaseFieldTextState {
    readonly value: string;
}
interface BaseFieldTextProps {
    readonly field: any;
    readonly emmit: Function;
}

export class BaseFieldText extends React.Component<BaseFieldTextProps, BaseFieldTextState> {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.getErrorMessageByInvalid = this.getErrorMessageByInvalid.bind(this);
        this.isValidate = this.isValidate.bind(this);
        this.state = {
            value: '',
        }
    }

    componentDidMount() {
        const defaultValue = this.props.field.defaultValue;
        this.setState({value: defaultValue?.length ? defaultValue : ''})
    }

    handleInput({ currentTarget }) {
        this.setState({ value: currentTarget.value });
        const valid = this.isValidate(currentTarget.value);
        this.props.emmit({
            name: this.props.field.attrs.name,
            value: currentTarget.value,
            valid
        });
    }
    isValidate(value) {
        const isValid = this.props.field.validate.every(({ checkValid }) => (checkValid(value)));
        return isValid;
    }
    getErrorMessageByInvalid() {
        const errors = this.props.field.validate
            .filter(({ checkValid, error_message }) => (!checkValid(this.state.value)))
            .map(({ error_message }) => (error_message(this.state.value)));
        return errors;
    }

    render() {
        const errorsMessages = this.getErrorMessageByInvalid();
        const { field } = this.props;
        const { attrs, props } = field;
        const propsInput = { ...attrs, ...props };
        console.log(field.defaultValue)

        return (
            <label>
                {field.name}
                <Input {...propsInput} value={field.defaultValue} onInput={this.handleInput} />
                {field.isCheckForm && !this.isValidate(this.state.value) && errorsMessages.map(error_message => (
                    <Message message={error_message} key={error_message}></Message>
                ))}
                {field.isCheckForm && this.isValidate(this.state.value) && <Message message='Все хорошо' />}
            </label>
        )
    }
}