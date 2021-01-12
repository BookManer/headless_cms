interface validatePayload {
    checkValid: (val: any) => boolean;
    error_message: (val?: string) => string;
}

/**
 * @module
 * @description Хук валидации. Проверяет значение с помощью конфигурируемых валидаторов
 * @param value{string} - валидирумое значение
 * @param validate{Array<validatePayload>} - список валидатор с выводом сообщения об ошибке
 * @returns {boolean}
 */
export function useValidate(value: string, validate: Array<validatePayload>) {
    const completedValidators = validate.every(({checkValid, error_message}) => {
        return !!checkValid(value);
    })

    return completedValidators;
}