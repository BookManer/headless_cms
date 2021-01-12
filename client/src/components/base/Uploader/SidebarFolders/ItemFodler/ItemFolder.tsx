import { CustomerServiceFilled, FileExcelFilled, FileImageOutlined, FileOutlined, FilePdfFilled, FilePptFilled, FileWordFilled, FolderOpenOutlined, FolderOutlined, VideoCameraFilled } from '@ant-design/icons';
import React, { useMemo, useRef, useState } from 'react';
import { ToastsStore } from 'react-toasts';
import { api } from '../../../../../http';
import styles from './ItemFolder.module.css';
import { v4 as uuid } from 'uuid';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Loader } from '../../../../Loader';
import ModalAddFolder from '../../../../modals/ModalAddFolder/ModalAddFolder';
import ModalEditFile from '../../../../modals/ModalEditFile/ModalEditFile';
import formsSchema from '../../../../../config/forms.schema';
const path = require('path');

const videoExtension = [".3g2", ".3gp", ".3gp2", ".3gpp", ".asf", ".asx", ".avi", ".drv", ".flv", ".h264", ".mkv", ".mov", ".mp4", ".mpg", ".rm", ".srt", ".stl", ".swf", ".vid", ".vob", ".wmv"];
const imageExtension = ['.psd', '.tiff', '.bmp', '.jpg', '.jp2', '.j2k', '.jpf', '.jpm', '.jpg2', '.j2c', '.jpc', '.jxr', '.gif', '.eps', '.png', '.pict', '.pcx', '.ico', '.cdr', '.ai', '.raw', '.svg', '.webp'];
const audioExtension = [".aif", ".aiff", ".aob", ".ape", ".asf", ".aud", ".aud", ".cdr", ".gpx", ".ics", ".iff", ".m3u", ".m4a", ".m4p", ".mid", ".mp3", ".mp3", ".mp3", ".mpa", ".mts", ".nkc", ".ra", ".wav", ".wave", ".wma", ".xsb", ".xwb"];
const wordExtension = ['.docx', '.docm', '.dotx', '.dotm'];
const excelExtension = ['.xlsx', '.xlsm', '.xltx', '.xltm', '.xlsb', '.xlam'];
const powerPointExtension = ['.pptx', '.pptm', '.ppsx', '.ppsm', '.potx', '.potm', '.ppam'];

export const ItemFolder: React.FC<any> = inject('mediaStore')(observer(
    (props) => {
        const [open, setOpen] = useState(false);
        const [item, setItem] = useState(props.item);
        const [items, setItems] = useState(props.item.files);
        const [isDelete, toDelete] = useState(false);
        const [isLoaded, toggleLoaded] = useState(false);
        const [isOpenEditModal, setVisibleEditModal] = useState(false);
        const el_fakeInput = useRef();
        const el_itemFolder = useRef();
        const schemaAddFolder = formsSchema.addFolder;
        const noActions = props.noActions; // don't visual action buttons

        const renderIconFile = useMemo(() => {
            const lastFindDot = item.name.lastIndexOf('.');
            const extItem = item.name.substring(lastFindDot, item.name.length);
            const isAudioFile = audioExtension.includes(extItem);
            const isImageFile = imageExtension.includes(extItem);
            const isVideoFile = videoExtension.includes(extItem);
            const isWordFile = wordExtension.includes(extItem);
            const isExcelFile = excelExtension.includes(extItem);
            const isPowerPointFile = powerPointExtension.includes(extItem);
            const isPDF = ['.pdf'].includes(extItem);

            if (isImageFile) {
                return <FileImageOutlined className={styles.iconFile} />;
            } else if (isVideoFile) {
                return <VideoCameraFilled className={styles.iconFile} />;
            } else if (isAudioFile) {
                return <CustomerServiceFilled className={styles.iconFile} />;
            } else if (isWordFile) {
                return <FileWordFilled className={styles.iconFile} />;
            } else if (isExcelFile) {
                return <FileExcelFilled className={styles.iconFile} />;
            } else if (isPowerPointFile) {
                return <FilePptFilled className={styles.iconFile} />;
            } else if (isPDF) {
                return <FilePdfFilled className={styles.iconFile} />
            } else {
                return <FileOutlined className={styles.iconFile} />;
            }
        }, [item.isFolder]);
        const handleAddFolder = (payload: object) => {
            setItems([ ...items, payload]);
        }
        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const el: HTMLElement = el_fakeInput.current; // fake textarea for effect drop
            el.classList.add(styles.active);
            el.classList.add(styles.active);

            const elItem: HTMLElement = el_itemFolder.current; // a paranet element item

            if (!elItem.classList.contains(styles.dragenter)) {
                elItem.classList.add(styles.dragenter);
            }
        }
        const handleDragLeave = (e) => {
            e.stopPropagation();
            const el: HTMLElement = el_itemFolder.current;
            el.classList.remove(styles.dragenter);
        }
        const handleDragLeaveFakeDropzone = (e) => {
            e.stopPropagation();
            const el: HTMLElement = el_fakeInput.current;
            el.classList.remove(styles.active);

            const elItem: HTMLElement = el_itemFolder.current;
            elItem.classList.remove(styles.dragenter);
        }
        const handleDropFile = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            // if (e.dataTransfer.dropEffect === 'none') {
            //     return;
            // }
            try {
                toggleLoaded(true);
                const formData = props.mediaStore.getFormDataStore();
                let data = JSON.parse(localStorage.getItem("drag'n'drop file"));
                if (Object.getPrototypeOf(data) !== Array.prototype) {
                    const el: any = el_fakeInput.current;
                    el.value = "";
                    el.classList.remove(styles.active);

                    const isAlsoExistsFile = items?.find(item => item.name === data.name);
                    if (!isAlsoExistsFile) {
                        const id = uuid();
                        if (item.isFolder) {
                            const payload = {
                                id,
                                name: path.basename(item.dirFolder + '/' + data.name),
                                alternative: data.name,
                                title: data.name,
                                lazy: 0,
                                relativePath: item.dirFolder,
                            }
                            await api.uploadMedia(payload, formData);
                            toggleLoaded(false);
                            setOpen(true);
                            const dateCreated = new Date(Date.now());
                            setItems([...items, {
                                id,
                                ...data,
                                date_created: dateCreated,
                                date_last_updated: dateCreated,
                                relativePath: item.dirFolder
                            }]);
                            ToastsStore.success('Файл успешно добавлен');
                        } else {
                            ToastsStore.warning('Это файл, а не папка!');
                            toggleLoaded(false);
                            return;
                        }
                    } else {
                        ToastsStore.warning('Данный файл уже существует');
                        toggleLoaded(false);
                        return;
                    }
                } else {
                    if (!item.isFolder) {
                        ToastsStore.warning('Это файл, а не папка!');
                        toggleLoaded(false);
                        return;
                    }
                    let droppedFiles: any[] = props.mediaStore.getActiveSelectedFiles();
                    let readyDroppedFiles = droppedFiles.filter((droppedFile: any) => {
                        const hasInItems = items.length ? items.find((item: any) => (item.name === droppedFile.name)) : false;
                        return !hasInItems;
                    });
                    const formData = props.mediaStore.getActiveBinaryFormData()(readyDroppedFiles);
                    if (!readyDroppedFiles.length) {
                        toggleLoaded(false);
                        ToastsStore.warning(`К сожалению, все переносимые файлы уже существуют в папке "${item.dirFolder}"`, 3000);
                        return;
                    }
                    let fetchDroppedFiles = readyDroppedFiles.map(fetchDropedFile => ({
                        id: uuid(),
                        name: path.basename(item.dirFolder + '/' + fetchDropedFile.name),
                        alternative: fetchDropedFile.name,
                        title: fetchDropedFile.name,
                        lazy: 0,
                        relativePath: item.dirFolder,
                    }));
                    await api.uploadMedias(fetchDroppedFiles, formData);
                    toggleLoaded(false);
                    setOpen(true);
                    setItems([...items, ...readyDroppedFiles]);
                }
            } catch (e) {
                console.log(e);
            }
        }
        const handleDragging = (e) => {
            e.preventDefault();
            return false;
        }
        const handleDragEnter = (event: React.DragEvent) => {
            event.preventDefault();
            event.stopPropagation();
            const elItem: HTMLElement = el_itemFolder.current; // a paranet element item
            elItem.classList.add(styles.dragenter);
            setOpen(true);
        }
        const handleDeleteItem = (item: any) => {
            setItems(items?.filter(stateItem => (stateItem.name !== item.name)));
        }
        const handleClickEdit = (e: React.SyntheticEvent) => {
            e.stopPropagation();
            setVisibleEditModal(!isOpenEditModal);
        }

        return !isDelete ? (
            <div className={styles.wrap}>
                <div ref={el_itemFolder} className={`${styles.item} ${item.styledSearch ? styles.searched : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDragEnter={handleDragEnter}
                    onDrag={handleDragging}
                    title={item.size ? `Размер ${item.size} bytes` : ''}
                    onClick={() => setOpen(!open)}>
                    {item.isFolder ?
                        !open && !item.openFolder ? <FolderOutlined className={styles.iconFolder} /> : <FolderOpenOutlined className={styles.iconFolder} />
                        : null}
                    {!item.isFolder && renderIconFile}
                    <h3 onClick={handleDeleteItem} className={styles.nameFolder}>{item.name}</h3>
                    <ModalEditFile file={item}></ModalEditFile>
                    {item.isFolder && <span className={styles.countFiles}>{items?.length}</span>}
                    <input type="text" className={styles.fakeTextarea}
                        ref={el_fakeInput}
                        onDrop={handleDropFile}
                        onDragLeave={handleDragLeaveFakeDropzone}
                        multiple
                        accept="*" />
                </div>
                <div className={`${styles.childrens} ${item.styledSearch ? styles.childrensFocus : ""} ${(item.openChildren || open) ? styles.open : ''}`}>
                    { isLoaded && <Loader message="Загрузка файлов..." />}
                    {items ? items.map((item, idx) => (
                        <ItemFolder noActions={!!noActions} onDelete={handleDeleteItem} key={item.name + idx} dragedFile={props.dragedFile} item={item}></ItemFolder>
                    )) : null}
                    { !noActions && item.isFolder && <ModalAddFolder schema={schemaAddFolder} parentFolder={item} styles={styles} emmit={handleAddFolder}></ModalAddFolder> }
                </div>
            </div>
        ) : null;
    }
))