import React, { Fragment, useState } from 'react';
import { ItemFolder } from '../ItemFodler/ItemFolder';
import styles from './TreeListFolders.module.css';

export const TreeListFolders: React.FC<any> = (props) => {
    const { folders, noActions } = props;
    const [isOpenModal, openModal] = useState(false);

    const handleAddFolder = (data) => {
        const newFolder = {
            name: data.name,
            isFolder: data.isFolder,
            date_created: new Date(Date.now()),
            date_last_updated: new Date(Date.now()),
            dirFolder: data.name + "/",
            files: [],
        }
        props.addFolder(newFolder);
    }

    return (
        <Fragment>
            <div className={styles.listItem}>
                {folders?.map(item => (
                    <ItemFolder noActions={!!noActions} key={item.name} dragedFile={handleAddFolder} item={item}></ItemFolder>
                ))}
            </div>
        </Fragment>
    )
}