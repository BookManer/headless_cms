import { EditOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { ToastsStore } from 'react-toasts';
import formsSchema from '../../../config/forms.schema';
import BaseGeneratorForm from '../../base/BaseGeneratorForm';
import { TreeListFolders } from '../../base/Uploader/SidebarFolders/TreeListFolders/TreeListFolders';
import styles from './ModalEditFile.module.css';

const schema = formsSchema.editFileMeta;

interface IPayloadReturn {
    name: string;
    alternative?: string;
}
interface IProps {
    file?: any;
    onSaveChanges?: () => IPayloadReturn;
    onDelete?: () => IPayloadReturn;
    fileSystemStore?: any;
}

const ModalEditFile: React.FC<IProps> = (props) => {
    const [visible, setVisible] = useState(false);
    const [schemaState, setSchema] = useState(schema);

    useEffect(() => {
        let fields = schemaState.fields.map(field => {
            field = field.interceptorParams({
                attrs: {
                    ...field.attrs,
                    placeholder: props.file.name,
                },
                defaultValue: props.file.name
            });
            return field;
        })
        setSchema({ ...schemaState, fields });
    }, [props.file])

    const handleClickOpenModal = (e: SyntheticEvent) => {
        e.stopPropagation();
        setVisible(!visible);
    }
    const handleSubmitForm = (data: object, valid: boolean) => {
        props.fileSystemStore.edit(props.file.name, data);
        setVisible(false);
        if (!valid) {
            ToastsStore.warning('Не все обязательные поля заполнены!');
        }
    }
    const handleStopPropagation = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    }

    return (
        <div onClick={handleStopPropagation}>
            <EditOutlined className={styles.editButton} onClick={handleClickOpenModal} />
            <Modal title='Редактировать медиа-файл'
                visible={visible}
                footer={false}
                onCancel={handleClickOpenModal}>
                    <h3>Дочерние файлы/папки</h3>
                    { props.file?.files?.length ? <TreeListFolders noActions folders={props.file.files}></TreeListFolders> : <p>Нет файлов/папок</p> }
                    <BaseGeneratorForm 
                        onSubmitForm={handleSubmitForm}
                        schema={schemaState} 
                        submitButton={{ text: "Сохранить" }} />
            </Modal>
        </div>
    )
}

export default inject('fileSystemStore')(observer(ModalEditFile))