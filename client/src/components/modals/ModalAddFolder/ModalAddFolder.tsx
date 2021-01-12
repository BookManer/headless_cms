import { FolderAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import React, { Fragment, useState } from 'react';
import BaseGeneratorForm from '../../base/BaseGeneratorForm';

import localStyles from './ModalAddFolder.module.css';

const ModalAddFolder: React.FC<any> = (props) => {
    const [visible, toggleVisible] = useState<boolean>(props.visible);
    const addFolderSchema = props.schema;
    const { styles } = props;
    // Handlers
    const handleAddFolder = (dataForm: { name: string }, validForm: boolean) => {
        if (validForm) {
            props.emmit({
                ...dataForm,
                date_created: new Date(Date.now()),
                date_last_updated: new Date(Date.now()),
                dirFolder: props.parentFolder.dirFolder + '/' + dataForm.name + '/',
                dirname: props.parentFolder.diranme + '/' + dataForm.name + '/',
                relativePath: props.parentFolder.relativePath + '/' + dataForm.name + '/',
                isFolder: true,
                files: [],
                size: false,
            });
            toggleVisible(false);
        }
    }
    const handleCancelModal = () => {
        toggleVisible(false);
        // props.cancelModal(visible);
    }

    return (
        <Fragment>
            <figure className={styles.addFolderBlock} onClick={() => toggleVisible(true)}>
                <FolderAddOutlined className={styles.iconAddFolder} />
                <figcaption className={styles.addFolderMessage}>
                    Добавить новую папку
                    <Tooltip className={localStyles.info_message} title="При добавлении папки в ней обязательно нужно добавить какой-нибудь файл, иначе папка не загрузится на сервер">
                        <QuestionCircleOutlined />
                    </Tooltip>
                </figcaption>
            </figure>
            <Modal title={`Добавить новую модель`}
                footer={null}
                visible={visible}
                onCancel={handleCancelModal}>
                <p className={localStyles.info_message}>При добавлении папки <b>не забывайте</b>, что она не будет сохранена до тех пор, пока Вы не добавите в неё хотя бы один файл</p>
                <BaseGeneratorForm onSubmitForm={handleAddFolder} schema={addFolderSchema} submitButton={{ text: "Добавить" }}></BaseGeneratorForm>
            </Modal>
        </Fragment>
    )
}

export default ModalAddFolder;