import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { FormContext } from '../../contexts/GeneratedForm.context';

interface BaseFieldMediaProps {
    readonly field: any;
    readonly emmit: Function;
}
interface BaseFieldMediaState {
    uploadedFile: object;
}

export const BaseFieldMedia: React.FC<BaseFieldMediaProps> = (props: any) => {
    const formContext = useContext<any>(FormContext);
    const [settingUploader, setSettingUploader] = useState({
        name: 'media_upload',
        onChange(info) {
            console.log(info);
        }
    })

    return (
        <Fragment>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
        </Fragment>
    )
}