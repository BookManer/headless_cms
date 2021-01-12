import React from 'react';
import { FieldModel } from '../../../service-DB/models';

type typeDataContext = {
    onDeleted?: (field: FieldModel) => Promise<void>,
    onUpdated?: (field: FieldModel) => Promise<void>,
    onAdded?: (field: object | FieldModel, validForm: boolean) => Promise<void>, 
}

export const ContextActionFields = React.createContext<typeDataContext>({});