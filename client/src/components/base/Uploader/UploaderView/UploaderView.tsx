import React, { Fragment, useContext } from 'react';
import { UploadCardItem } from '../UploadCardItem/UploadCardItem';
import UploaderActionPanel from '../UploaderActionPanel/UploaderActionPanel';
import { UploaderContext } from '../../../../contexts/UploaderContext';
import styles from './UploaderView.module.css';

export const UploaderView: React.FC<any> = (props) => {
    const context = useContext(UploaderContext);
    const handleDeleteItems = (elements: any | any[]) => {
        context.deleteItem([elements].flat(1));
    }

    return (
        <Fragment>
            <UploaderActionPanel files={props.files}></UploaderActionPanel>
            <div className={styles.viewFiles}>
                <div className={styles.infoBlock}>
                    <b>Добавленно: ({props.files.length})</b>
                    <p>Файлы добавлены в резерв, не загруженны на сервер, для этого с помощью верхней панели - выберите нужные файлы и подтвердите загрузку</p>
                </div>
                <div className={styles.listFiles}>
                    {Array.from(props.files).map((file, idx) => (
                        <UploadCardItem deleteItem={handleDeleteItems} key={idx} file={file}></UploadCardItem>
                    ))}
                </div>
            </div>
        </Fragment>
    )
}
