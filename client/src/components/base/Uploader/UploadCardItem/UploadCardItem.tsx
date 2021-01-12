import { DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { UploaderContext } from '../../../../contexts/UploaderContext';
import styles from './UploadCardItem.module.css';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

let cacheBase64Files = {}

export const UploadCardItem: React.FC<any> = inject('mediaStore')(observer(
    (props) => {
        const [isLoadedPreview, setLoadedPreview] = useState(false);
        const [srcPreview, setSrcPreview] = useState('');
        const uploadContext = useContext(UploaderContext);
        const { file } = props;
        const { size, type } = file;
        const [actionSelected, setActionSelected] = useState(props.file.action_selected);
    
        useEffect(() => {
            if (isImage) {
                previewImage();
            }
        })
    
        const previewImage = () => {
            if (!cacheBase64Files[file.name]) {
                const reader: any = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    cacheBase64Files[file.name] = reader.result;
                    setSrcPreview(reader.result);
                    setLoadedPreview(true);
                }
            } else {
                setSrcPreview(cacheBase64Files[file.name]);
                setLoadedPreview(true);
            }
        }
        const handleToggleSelected = () => {
            if (uploadContext.selectMode) {
                uploadContext.selectFiles([file], !file.action_selected);
            }
        }
        const handleDeleteElement = (e) => {
            e.stopPropagation();
            let newFile = file;
            newFile.action_selected = true;
            uploadContext.deleteItem([newFile]);
        }
        const formatedBytes = useMemo(() => {
            return `${(size / 1024).toFixed(2)} KB`;
        }, [size]);
        const isImage = useMemo(() => {
            const res = /image/ig.test(type);
            return res;
        }, [type])
        const handleDragStart = async (e: React.DragEvent<HTMLElement>) => {
            const el = e.currentTarget;
            e.dataTransfer.dropEffect = "move"
            e.currentTarget.style.left = `${e.pageX}px`;
            e.currentTarget.style.top = `${e.pageY}px`;
    
            const formData: any = new FormData();
            const selectedFiles: any[] = uploadContext.files
                .filter(file => file.action_selected && uploadContext.selectMode)
                .map(file => {
                    const fileData: any = { 
                        name: file.name,
                        type: file.type,
                        lastModified: file.lastModified,
                        size: file.size,
                    };
                    return new File([fileData], fileData.name);
                })
            if (selectedFiles?.length) {
                const el_selectedFiles: NodeListOf<HTMLElement> = document.querySelectorAll(`[data-selected=true]`);
                const filesJSON: any[] = [];
                el_selectedFiles.forEach((selectedFile: any, idx: number) => {
                    // Assertion a file and writing to FormData
                    formData.append(`media_upload`, uploadContext.files[idx], uploadContext.files[idx].originalname);
                    // Assertion payloads by files to localStorage 
                    const selectFileData = selectedFiles[idx];
                    const { name, lastModified, size } = selectFileData;
                    filesJSON.push({name, lastModified, size});
                    selectedFile.classList.add(styles.dragstart);
                })
                localStorage.setItem("drag'n'drop file", JSON.stringify(filesJSON))
                props.mediaStore.setFormData(formData);
            } else {
                const form = new FormData();
                form.append('media_upload', file, file.originname || file.name);
                props.mediaStore.setFormData(form);
                const fileJSON = { name: file.name, lastModified: file.lastModified, size: file.size, type: file.type };
                localStorage.setItem("drag'n'drop file", JSON.stringify(fileJSON));
                el.classList.add(styles.dragstart);
            }
    
            return true;
        }
        const handleDrag = (e: React.DragEvent<HTMLElement>) => {
            e.dataTransfer.dropEffect = "move";
            e.currentTarget.style.left = `${e.pageX}px`;
            e.currentTarget.style.top = `${e.pageY}px`;
    
            const selectedFiles = uploadContext.files
                .filter(file => file.action_selected && uploadContext.selectMode)
                .map(file => ({
                    name: file.name,
                    type: file.type,
                    lastModified: file.lastModified,
                    size: file.size,
                }));
            if (selectedFiles?.length) {
                const el_selectedFiles = document.querySelectorAll(`[data-selected=true]`);
                el_selectedFiles.forEach((selectedFile: HTMLElement) => {
                    selectedFile.classList.add(styles.dragstart);
                    selectedFile.style.left = `${e.pageX}px`;
                    selectedFile.style.top = `${e.pageY}px`;
                });
                // e.dataTransfer.setData("text/plain", JSON.stringify(selectedFiles));
                props.mediaStore.setSelectedFiles(selectedFiles);
            }
        }
        const handleFinishDraging = (e: React.DragEvent<HTMLElement>) => {
            e.currentTarget.classList.remove(styles.dragstart);
            e.currentTarget.style.top = "unset";
            e.currentTarget.style.left = "unset";
    
            const selectedFiles = uploadContext.files
                .filter(file => file.action_selected && uploadContext.selectMode)
                .map(file => ({
                    name: file.name,
                    type: file.type,
                    lastModified: file.lastModified,
                    size: file.size,
                }));
            if (selectedFiles?.length) {
                const el_selectedFiles = document.querySelectorAll(`[data-selected=true]`);
                el_selectedFiles.forEach((selectedFile: HTMLElement) => {
                    selectedFile.classList.remove(styles.dragstart);
                    selectedFile.style.left = "unset";
                    selectedFile.style.top = "unset";
                })
            }
        }
    
        return (
            <Fragment>
                <figure data-selected={file.action_selected} draggable className={styles.card}
                    onClick={handleToggleSelected}
                    onDragStart={handleDragStart}
                    onDrag={handleDrag}
                    onDragEnd={handleFinishDraging}>
                    {(file.action_selected && uploadContext.selectMode) && <div className={styles.checkIcon} />}
                    {isImage ?
                        isLoadedPreview ? <img className={styles.cardPicture} src={cacheBase64Files[file.name] || srcPreview} alt="picture" /> : <Skeleton.Image />
                        : <FileOutlined className={styles.fileIcon} />
                    }
                    <figcaption>{file.name} {formatedBytes}</figcaption>
                    <DeleteOutlined style={{ color: "red" }} onClick={handleDeleteElement} />
                </figure>
            </Fragment>
        )
    }
))