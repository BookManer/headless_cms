import React from 'react';

export const UploaderContext = React.createContext<{
    files?: any[],
    selectFiles?: (files: any[], doActive: boolean) => void,
    sortFiles?: (files: any[]) => void,
    deleteItem?: (file: any) => void,
    toggleSelectMode?: (toggle: boolean) => void,
    addDirectory?: (data: any) => void,
    selectMode?: boolean,
}>({});