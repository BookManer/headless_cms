import React, { Fragment, useState } from 'react';
import { UploaderContext } from '../../../../contexts/UploaderContext';
import { UploaderController } from '../UploaderController/UploaderController';
import { UploaderView } from '..//UploaderView/UploaderView';
import styles from './UploaderFiles.module.css';
import { SidebarFolders } from '../SidebarFolders/SidebarFolders';

export const UploaderFiles: React.FC<any> = (props) => {
    const [state_files, setFiles] = useState<any[]>([]);
    const [sorted_files, setSortedFiles] = useState<any[]>([]);
    const [directories, setDirectories] = useState<any[]>([{
        name: 'test',
        alt: 'Directory "test"',
        size: 34901,
        files: [state_files],
    }]);
    const [selectMode, setSelectMode] = useState(false);

    const handleDeleteItem = (files: any[]) => {
        const activatedFiles = Array.from(state_files).filter((file: any) => {
            return !file.action_selected;
        })
        setFiles(activatedFiles);
    }
    const handleSelectFiles = (files: any[], doActive: boolean) => {
        files = Array.from(files).flat(1);
        const activatedFiles = Array.from(state_files).map((file: any) => {
            const foundFile = files.find((fileFounded) => fileFounded.name == file.name);
            if (foundFile) {
                foundFile.action_selected = doActive;
                return foundFile;
            }
            return file;
        })
        setFiles(activatedFiles);
    }
    const handleSortFiles = (sortedFiles: any[]) => {
        setSortedFiles(sortedFiles);
    }
    const handleUploadedFiles = (files: any[]) => {
        setFiles(files);
        setSortedFiles(files);
    }

    const defaultPayloadContext = {
        files: state_files, // все загруженные файлы
        selectFiles: handleSelectFiles, // устанавливает пометку, что файл выбран
        sortFiles: handleSortFiles, // сортировка файлов
        deleteItem: handleDeleteItem, // удаление файлов
        toggleSelectMode: (toggle: boolean) => setSelectMode(toggle), // вкл/выкл множественный выбор
        selectMode, // режим множественного выбора
    }

    return (
        <Fragment>
            <div className={styles.wrap}>
                <div className={styles.left}>
                    <SidebarFolders></SidebarFolders>
                </div>
                <div className={styles.right}>
                    <div className={styles.uploader}></div>
                    <UploaderContext.Provider value={defaultPayloadContext}>
                        <UploaderController emmit={handleUploadedFiles}></UploaderController>
                        <UploaderView deleteElement={handleDeleteItem} files={sorted_files || state_files}></UploaderView>
                    </UploaderContext.Provider>
                </div>
            </div>
        </Fragment>
    )
}