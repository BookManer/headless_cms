import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Tag } from 'antd';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import styles from './SearchFolders.module.css';

export const SearchFolders: React.FC<any> = (props) => {
    const [searchText, toSearch] = useState('');

    const handleInputSearch = ({ currentTarget }) => {
        const { value } = currentTarget;
        toSearch(value);
    }

    const handleResetSearch = () => {
        toSearch('');
        function recursiveResetItem(item: any) {
            item.openFolder = false;
            item.openChildren = false;
            item.styledSearch = false;

            if (item.isFolder && item.files.length) {
                item.files = item.files.map(file => recursiveResetItem(file));
            }

            return item;
        }
        // Reset settings search effect by files and folders
        props.folders.forEach(folder => {
            props.onSearch(recursiveResetItem(folder));
        })
    }

    const doSearch = useMemo(() => {
        return !!searchText.length;
    }, [searchText]);

    const filterFolders = (folders: any[]) => {
        const regxp = new RegExp(`${searchText}`, 'ig');
        function search(item: any) {
            // some imeplementation
            if (regxp.test(item.name) && searchText !== '') {
                item.searched = true;
                item.styledSearch = true;
                item.openFolder = true;
                item.openChildren = true;
            } else {
                item.searched = false;
                item.styledSearch = false;
                item.openFolder = false;
                item.openChildren = false;
            }

            if (item.files) {
                let countSearched = 0;
                item.files = item.files.map((file) => {
                    const res = search(file);
                    if (res.searched || res.openFolder) {
                        ++countSearched;
                    }
                    return res;
                })
                if (countSearched) {
                    item.openFolder = true;
                    item.openChildren = true;
                    return item;
                }
            }

            return item;
        }

        return folders.map(folder => {
            const res = search(folder);
            return res;
        })
    }

    return (
        <Fragment>
            <div className={styles.searchBlock}>
                <label htmlFor="" className={styles.searchLabel}>
                    <Input onInput={handleInputSearch} value={searchText} addonBefore={'Найти'} />
                    <SearchOutlined
                        className={styles.btnSearch}
                        onClick={() => { props.onSearch(filterFolders(props.folders)); }}></SearchOutlined>
                </label>
                {doSearch ? <Button onClick={handleResetSearch}>Сбросить</Button> : null}
            </div>
        </Fragment>
    )
}