import { Checkbox, Switch } from 'antd';
import React from 'react';

interface BaseSelectPayload {
    props: {
        defaultOption?: string;
        placeholder?: string;
        items: Array<string | object | JSX.Element>;
    },
    defaultValue?: string | boolean;
    attrs: any;
    name: string;
    disable: boolean;
    isCheckForm: boolean;
    syncLocalStorage: boolean;
    nested_list?: any;
    custom_field?: any;
    validate: Array<any>;
}

interface BaseFieldCheckboxState {
    readonly checked: boolean;
}
interface BaseFieldCheckboxProps {
    readonly field: BaseSelectPayload;
    readonly emmit?: (payload: object) => void;
}

export class BaseFieldCheckbox extends React.Component<BaseFieldCheckboxProps, BaseFieldCheckboxState> {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            checked: false,
        }
    }
    handleChange(checked) {
        this.setState({ checked });
        this.props.emmit({
            name: this.props.field.attrs.name,
            value: checked,
            valid: true
        });
    }

    render() {
        return (
            <label>
                {this.props.field.name}
                <Switch {...this.props.field.attrs} defaultChecked={this.props.field.defaultValue} onChange={this.handleChange} />
            </label>
        )
    }
}