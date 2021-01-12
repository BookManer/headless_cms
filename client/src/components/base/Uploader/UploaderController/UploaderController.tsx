import React, { Fragment, useRef, useState } from 'react';
import { ToastsStore } from 'react-toasts';
import styles from './UploaderController.module.css';

const unreadMimetypes = [
    "application/x-msdownload",
    "x-msdos-program",
    ".apk",
    ".bat",
    ".bin",
    ".bin",
    ".cgi",
    ".cmd",
    ".cmd",
    ".cmd",
    ".com",
    ".cpp",
    ".js",
    ".jse",
    ".exe",
    ".gadget",
    ".gtp",
    ".hta",
    ".jar",
    ".msi",
    ".msu",
    ".paf.exe",
    ".pif",
    ".ps1",
    ".pwz",
    ".scr",
    ".thm",
    ".vb",
    ".vbe",
    ".vbs",
    ".wsf",
];

export interface FileFormated {
    name: string; // originalname a file
    type: string; // type a file
    size: number; // bytes size a file
    action_selected: boolean;
    weightDisplay?: string;
}

interface UploaderProps {
    emmit: (files: FileFormated[]) => void;
    detectDragElements?: ({ isFiles: boolean }) => void;
}

export const UploaderController: React.FC<UploaderProps> = (props) => {
    const [files, setFiles] = useState({});
    const refDropZone = useRef();
    const fakeFileElement = useRef();

    const handleUploadFiles = ({ currentTarget }) => {
        const { files: uploadedFiles } = currentTarget;
        const filteredFiles = [];
        const errorFiles = [];
        for (let file of uploadedFiles) {
            if (!unreadMimetypes.includes(file.type)) {
                filteredFiles.push(file)
            } else {
                errorFiles.push(file);
            }
        }
        ToastsStore.error(`Файлы ${Array.from(errorFiles).map(file => file.name).join(', ')} могут быть небезопасными!`, errorFiles.length * 1000);
        props.emmit(Array.from(filteredFiles));
        setFiles(Array.from(uploadedFiles));
    }
    const handleDragEnter = (e => {
        const el: HTMLElement = refDropZone.current;
        const isFiles = [].some.call(e.dataTransfer.types, (type) => type === "Files");
        props.detectDragElements && props.detectDragElements({ isFiles });

        if (isFiles) {
            el.classList.add(styles.dragEnter);
        } else {
            el.classList.add(styles.dragTypeFileError);
        }
    })
    const handleDragLeave = (e => {
        const el: HTMLElement = refDropZone.current;
        el.classList.remove(styles.dragEnter);
        el.classList.remove(styles.dragTypeFileError);
    })
    const handleDragDrop = (e => {
        const el: HTMLElement = refDropZone.current;
        const { dataTransfer } = e;
        el.classList.remove(styles.dragEnter);

        props.emmit(Array.from(dataTransfer.files).map((file) => {
            let newFile: any = file;
            newFile.action_selected = false;
            return newFile;
        }));
    })
    const handleClickUpload = () => {
        const el_file_input = fakeFileElement.current as HTMLElement;
        el_file_input.click();
        el_file_input.addEventListener('input', handleUploadFiles);
    }


    return (
        <Fragment>
            <div ref={refDropZone} className={styles.uploaderContainer}
                onDragLeave={handleDragLeave}
                onDragCapture={handleDragDrop}>
                <button onClick={handleClickUpload} className={styles.uploadBtn}>Загрузить файл</button>
                <p className={styles.paragraph}>или перетащите файл сюда</p>
                <input ref={fakeFileElement} onDrop={handleDragDrop} onDragOver={handleDragEnter} className={styles.fakeFileInput} type="file" multiple />
            </div>
        </Fragment>
    )
}