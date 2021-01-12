import React from 'react';
import { Select } from 'antd';
const { Option } = Select;

interface BaseSelectProps {
    items: Array<string | {text: string, value: string}>;
    emmit: (payload: object) => any;
}

class BaseSelect extends React.Component<BaseSelectProps, any> {
    constructor(props) {
        super(props);
        this.handlerChange = this.handlerChange.bind(this);
        this.renderOption = this.renderOption.bind(this);
    }
    renderOption(option: string | {text: string, value: string}) {
        if (typeof option === 'string') {
            return (<Option key={option} value={option}>{option}</Option>)
        } else if (typeof option === 'object') {
            return (<Option key={option.text} value={option.value}>{option.text}</Option>)
        }
    }
    async handlerChange(selected) {
        const {emmit} = this.props;

        const value = (typeof selected === 'string') ? selected : selected.text;
        const payload = {
            name: 'type',
            value,
            valid: true,
        };
        emmit(payload);
    }

    render() {
        const { items } = this.props;
        return (
            <Select placeholder="Выберите" onChange={this.handlerChange}>
                {items?.length && items.map((option: any) => (
                    this.renderOption(option)
                ))}
            </Select>
        )
    }
}

export {BaseSelect};