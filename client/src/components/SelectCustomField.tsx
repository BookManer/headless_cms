import React, { Fragment } from 'react';
import { BaseFieldCheckbox } from './base/BaseFieldCheckbox';
import { BaseFieldText } from './base/BaseFieldText';
import { BaseSelect } from './base/BaseSelect';
import { TypeComponentFields } from '../config/enums';
import ListFields from './ListFields';
import { api } from '../http';

import { FormContext } from '../contexts/GeneratedForm.context';
import { withRouter } from 'react-router-dom';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import BaseMarkdownEditor from './base/MarkdownEditor/BaseMarkdownEditor';
import { BaseFieldMedia } from './base/BaseFieldMedia';

interface BaseSelectPayload {
    props: {
        defaultOption?: string;
        placeholder?: string;
        items: Array<string | object | JSX.Element>;
    },
    attrs: object,
    name: string,
    disable: boolean,
    isCheckForm: boolean,
    syncLocalStorage: boolean,
    validate: Array<any>
}
interface BaseSelectProps {
    field: BaseSelectPayload;
    match: any;
    entityStore: any;
    emmit: (payload: object) => any;
}

@inject('entityStore')
@observer
class SelectCustomField extends React.Component<BaseSelectProps, any> {
    static contextType = FormContext;

    constructor(props) {
        super(props);
        this.handlerSelectTypeField = this.handlerSelectTypeField.bind(this);
        this.renderCustomFieldByComponent = this.renderCustomFieldByComponent.bind(this);
        this.handlerTypeCustomField = this.handlerTypeCustomField.bind(this);
        this.handlerListField = this.handlerListField.bind(this);
        this.state = {
            selectedType: ''
        }
    }

    handlerSelectTypeField(selectedTypeField: { name: string, value: TypeComponentFields, valid: boolean }) {
        const { emmit } = this.props;
        this.setState({
            selectedType: selectedTypeField.value
        });
        emmit({ ...selectedTypeField }); // отправляем сначала значение выбранного поля 
    }

    handlerTypeCustomField(payload: object) {
        const { emmit } = this.props;
        emmit({ ...payload }); // отправляем сначала значение выбранного поля 
    }
    async handlerListField(listPayload: any) {
        const { emmit } = this.props;
        emmit({ ...listPayload });
    }

    renderCustomFieldByComponent() {
        const { selectedType } = this.state;

        if (selectedType.length) {
            switch (selectedType) {
                case TypeComponentFields.Text:
                    return (<BaseFieldText field={this.props.field} emmit={this.handlerTypeCustomField} />);
                case TypeComponentFields.Checkbox:
                    return (<BaseFieldCheckbox field={this.props.field} emmit={this.handlerTypeCustomField} />);
                case TypeComponentFields.List:
                    return (<ListFields field={this.props.field} emmit={this.handlerListField} />)
                case TypeComponentFields.Markdown:
                    return (<BaseMarkdownEditor field={this.props.field} emmit={this.handlerSelectTypeField} />)
                case TypeComponentFields.Media:
                    return (<BaseFieldMedia field={this.props.field} emmit={this.handlerTypeCustomField} />)
            }
        }
    }

    render() {
        const { field } = this.props;
        const items = field.props.items as Array<{text: string, value: string}>
        
        return (
            <Fragment>
                <BaseSelect items={items} emmit={this.handlerSelectTypeField}></BaseSelect>
                <p>{this.renderCustomFieldByComponent()}</p>
            </Fragment>
        )
    }
}

export default withRouter(SelectCustomField);