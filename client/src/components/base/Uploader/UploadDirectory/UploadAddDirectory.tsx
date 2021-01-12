import { FolderAddOutlined } from '@ant-design/icons';
import React, { useContext, useState } from 'react';
import formsSchema from '../../../../config/forms.schema';
import { UploaderContext } from '../../../../contexts/UploaderContext';
import ModalAddFolder from '../../../modals/ModalAddFolder/ModalAddFolder';
import styles from './UploadDirectory.module.css';

export const UploadAddDirectory: React.FC<any> = (props) => {
    const [isOpenModal, openModal] = useState(false);
    const uploadContext = useContext(UploaderContext);

    const handleAddedFolder = (data: { name: string }) => {
        uploadContext.addDirectory(data);
    }

    return (
        <div className={styles.blockAddFolder}>
            <FolderAddOutlined onClick={() => openModal(true)} className={styles.iconAddFolder}></FolderAddOutlined>
            <p className={styles.actionText}>Добавить папку</p>
            { isOpenModal && <ModalAddFolder cancelModal={() => openModal(false)} schema={formsSchema.addFolder} emmit={handleAddedFolder}></ModalAddFolder> }
        </div>
    )
}