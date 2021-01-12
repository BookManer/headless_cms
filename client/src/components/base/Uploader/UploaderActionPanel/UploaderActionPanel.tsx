import { Button, Checkbox, Radio, Tag } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import React, { Fragment, useContext, useMemo, useState } from 'react';
import { UploaderContext } from '../../../../contexts/UploaderContext';
import styles from './UploaderActionPanel.module.css';

interface IActionPanelProps {
    files: any[];
}

enum SortEnum {
    BY_NAME = 0,
    BY_SIZE = 1,
    RESET = 2
}

let localStoreFiles = [];

const UploaderActionPanel: React.FC<IActionPanelProps> = (props) => {
    const [doActionSelectAll, toggleDoActionSelectAll] = useState(false);
    const [valueSort, setValueSort] = useState<SortEnum>(SortEnum.RESET);
    const uploadContext = useContext(UploaderContext);

    // handles
    const handleSortBySize = () => {
        let sortedFiles = Array.from(props.files).sort((fileA: any, fileB: any) => {
            if (fileA.size > fileB.size) {
                return 1;
            }
            return -1;
        });
        uploadContext.sortFiles(sortedFiles);
    }
    const handleSortByName = () => {
        let sortedFiles = Array.from(props.files).sort((fileA: any, fileB: any) => {
            if (fileA.name > fileB.name) {
                return 1;
            }
            return -1;
        });
        uploadContext.sortFiles(sortedFiles);
    }
    const handleChangeStateSort = (event: RadioChangeEvent) => {
        const value = event.target.value;
        switch (value) {
            case SortEnum.BY_NAME:
                handleSortByName();
                break;
            case SortEnum.BY_SIZE:
                handleSortBySize();
                break;
            case SortEnum.RESET:
                console.log(uploadContext.files);
                uploadContext.sortFiles(uploadContext.files);
                break;
        }
        setValueSort(event.target.value);
    }
    const handleToggleSelectModel = (event: object) => {
        uploadContext.toggleSelectMode(!uploadContext.selectMode);
    }
    const handleAcceptDelete = () => {
        uploadContext.deleteItem(props.files.filter(file => file.action_selected))
        uploadContext.toggleSelectMode(false);
    }
    const handleAcceptDeployStorage = () => {
        // some implementation
    }
    const handleSelectAllFiles = () => {
        toggleDoActionSelectAll(!doActionSelectAll);
        uploadContext.selectFiles([...Array.from(props.files).flat(1)], !doActionSelectAll);
    }
    // computeds
    const getCountActionSelected = () => {
        return props.files.filter(file => file.action_selected).length;
    }

    return (
        <Fragment>
            <div className={styles.containerActions}>
                <div className={styles.actionBlock}>
                    <h4>Сортировать:</h4>
                    <Radio.Group value={valueSort} onChange={handleChangeStateSort}>
                        <Radio value={SortEnum.BY_NAME}>по имени</Radio>
                        <Radio value={SortEnum.BY_SIZE}>по размеру</Radio>
                        <Radio value={SortEnum.RESET}>по умолчанию</Radio>
                    </Radio.Group>
                </div>
                <div className={styles.actionBlock}>
                    <h4>Множественный выбор</h4>
                    <p className={styles.actionGroup}>
                        <Checkbox checked={uploadContext.selectMode} onClick={handleToggleSelectModel}>{!uploadContext.selectMode ? "Включить" : "Выключить"}</Checkbox>
                        {uploadContext.selectMode && <Checkbox defaultChecked={doActionSelectAll} onClick={handleSelectAllFiles}>Выбрать все файлы: Выбранно <Tag color="green">{getCountActionSelected()}</Tag></Checkbox>}
                        {uploadContext.selectMode && <Button onClick={handleAcceptDelete} type="primary" danger>Удалить</Button>}
                        {uploadContext.selectMode && <Button onClick={handleAcceptDeployStorage} type="default">Загрузить на сервер {getCountActionSelected()} файл </Button>}
                    </p>
                </div>
            </div>
        </Fragment>
    )
}

export default UploaderActionPanel;