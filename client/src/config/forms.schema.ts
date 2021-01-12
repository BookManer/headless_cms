// validators
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import { TypeComponentFields } from "./enums";
import { BaseFieldCheckbox } from "../components/base/BaseFieldCheckbox";

// Fields
import { BaseFieldText } from "../components/base/BaseFieldText";
import SelectCustomField from "../components/SelectCustomField";
import SelectModel from "../components/SelectModel";

function interceptorParams(payloadParams: any) {
  if (Object.keys({ ...payloadParams }).length) {
    return { ...this, ...payloadParams };
  }

  const { interceptorParams, ...otherParams } = this;
  return otherParams;
}

export default {
  signUp: {
    title: "Зарегистрироваться",
    fields: [
      {
        name: "ФИО",
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {},
        attrs: {
          placeholder: "Фамилия Имя Отчество, например, Иванов Иван Иванович",
          name: "fio",
          type: "text",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Почта",
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {},
        attrs: {
          placeholder: "Например, default@mail.com",
          name: "email",
          type: "email",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
      },
      {
        name: "Пароль",
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: false,
        props: {},
        attrs: {
          placeholder: "Пароль",
          name: "password",
          type: "password",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
      },
      {
        name: "Повторите пароль",
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: false,
        props: {},
        attrs: {
          placeholder: "Повторите пароль",
          name: "repeat_password",
          type: "password",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
          {
            checkValid: (newPassword, repeatedPassword) =>
              newPassword === repeatedPassword,
            error_message: () => "Пароли не совпадают",
          },
        ],
      },
    ],
  },
  login: {
    title: "Войти в аккаунт",
    fields: [
      {
        name: "Почта",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {},
        attrs: {
          placeholder: "Почта",
          name: "login",
          type: "email",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
          {
            checkValid: (val) => isEmail(val),
            error_message: (val) =>
              `${val} не является почтой, попробуйте ещё раз`,
          },
        ],
        interceptorParams,
      },
      {
        name: "Пароль",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: false,
        props: {},
        attrs: {
          placeholder: "Пароль",
          name: "password",
          type: "password",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
    ],
  },
  addFieldForEntity: {
    title: "Добавить новое поле",
    fields: [
      {
        name: "Обязательное поле ?",
        type: TypeComponentFields.Checkbox,
        component: BaseFieldCheckbox,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите названия поля",
          name: "required",
        },
        attrs: {
          name: "required",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Название поля:",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите названия поля",
          name: "name",
        },
        attrs: {
          name: "name",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Placholder поля:",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "placholder...",
          name: "placeholder",
        },
        attrs: {
          name: "placeholder",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Значение нового поля: ",
        component: SelectCustomField,
        disable: false,
        syncLocalStorage: true,
        props: {
          items: [
            {
              value: TypeComponentFields.Text,
              text: "Текстовое поле",
            },
            {
              value: TypeComponentFields.Checkbox,
              text: "Чекбокс",
            },
            {
              value: TypeComponentFields.List,
              text: "Список",
            },
            {
              value: TypeComponentFields.Markdown,
              text: "Разметка"
            },
            {
              value: TypeComponentFields.Media,
              text: "Файл"
            }
          ],
          placeholder: "Выберите тип поля",
          name: "choose_field",
        },
        attrs: {
          name: "custom_field",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
    ],
  },
  addFieldForModel: {
    title: "Добавить новое поле",
    fields: [
      {
        name: "Обязательное поле ?",
        type: TypeComponentFields.Checkbox,
        component: BaseFieldCheckbox,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите названия поля",
          name: "required",
        },
        attrs: {
          name: "required",
        },
        validate: [
          {
            checkValid: (val) => true,
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Название поля:",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите названия поля",
          name: "name",
        },
        attrs: {
          name: "name",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Placholder поля:",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "placholder...",
          name: "placeholder",
        },
        attrs: {
          name: "placeholder",
        },
        validate: [
          {
            checkValid: (val) => true,
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
    ],
  },
  addEntity: {
    title: "Добавить новую сущность",
    fields: [
      {
        name: "Название",
        component: BaseFieldText,
        type: TypeComponentFields.Text,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите названия новой сущности",
          name: "name",
        },
        attrs: {
          name: "name",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Описание",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите описание новой сущности",
          name: "description",
        },
        attrs: {
          name: "description",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Статус",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Статус сущности",
          name: "status",
        },
        attrs: {
          name: "status",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
    ],
  },
  addEntityWithModel: {
    title: "Добавить новую сущность",
    fields: [
      {
        name: "Название",
        component: BaseFieldText,
        type: TypeComponentFields.Text,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите названия новой сущности",
          name: "name",
        },
        attrs: {
          name: "name",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Описание",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите описание новой сущности",
          name: "description",
        },
        attrs: {
          name: "description",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Статус",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Статус сущности",
          name: "status",
        },
        attrs: {
          name: "status",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      }, {
        name: "Выберите модель",
        type: TypeComponentFields.Select,
        component: SelectModel,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Модель",
          name: "choosed_model",
        },
        attrs: {
          name: "choosed_model"
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения"
          }
        ],
        interceptorParams,
      }
    ],
  },
  addModel: {
    title: "Добавить модель",
    fields: [
      {
        component: BaseFieldText,
        defaultValue: "",
        name: "Name модели:",
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите название модели",
        },
        attrs: {
          name: "name",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: (val) => "Поле обязательно для заполнения",
          },
          {
            checkValid: (val) => val.length > 2 && val.length < 32,
            error_message: (val) =>
              `Кол-во символов ${val.length} не входит в допустимый диапозон от 2 до 32`,
          },
        ],
        interceptorParams,
      },
      {
        component: BaseFieldText,
        defaultValue: "",
        name: "Title модели:",
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Название модели",
        },
        attrs: {
          name: "title",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: (val) => "Поле обязательно для заполнения",
          },
          {
            checkValid: (val) => val.length > 5 && val.length < 32,
            error_message: (val) =>
              `Кол-во символов ${val.length} не входит в допустимый диапозон от 5 до 32`,
          },
        ],
        interceptorParams,
      },
      {
        component: BaseFieldText,
        defaultValue: "",
        name: "Description модели:",
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Краткое описание модели",
        },
        attrs: {
          name: "description",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: (val) => "Поле обязательно для заполнения",
          },
          {
            checkValid: (val) => val.length > 32 && val.length < 256,
            error_message: (val) =>
              `Кол-во символов ${val.length} не входит в допустимый диапозон от 32 до 256`,
          },
        ],
        interceptorParams,
      },
    ],
  },
  editFieldList: {
    title: "Редактировать поле",
    fields: [
      {
        component: BaseFieldText,
        defaultValue: "",
        name: "Название поля:",
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите названия поля",
        },
        attrs: {
          name: "name",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: (val) => "Поле обязательно для заполнения",
          },
          {
            checkValid: (val) => val.length > 2 && val.length < 64,
            error_message: (val) =>
              `Кол-во символов должно быть в диапозоне от 2 до 64, а у Вас - ${val?.length}`,
          },
        ],
        interceptorParams,
      },
    ],
  },
  editField: {
    title: "Редактировать поле",
    fields: [
      {
        component: BaseFieldText,
        defaultValue: "",
        name: "Значение поля:",
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите названия поля",
        },
        attrs: {
          name: "custom_field",
        },
        validate: [
          {
            checkValid: (val) => true,
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        component: BaseFieldText,
        type: TypeComponentFields.Text,
        defaultValue: "",
        name: "Название поля",
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Название поля",
          name: "name",
        },
        attrs: {
          name: "name",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: (val) => "Поле обязательно для заполнения",
          },
          {
            checkValid: (val) => val.length > 2 && val.length < 64,
            error_message: (val) =>
              `Кол-во символов должно быть в диапозоне от 2 до 64, а у Вас - ${val?.length}`,
          },
        ],
        interceptorParams,
      },
      {
        component: BaseFieldCheckbox,
        type: TypeComponentFields.Checkbox,
        defaultValue: true,
        name: "Обязательно для заполнения",
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите названия поля",
          name: "required",
        },
        attrs: {
          name: "required",
        },
        validate: [
          {
            checkValid: (val) => true,
            error_message: () => "",
          },
        ],
        interceptorParams,
      },
    ],
  },
  addFieldForList: {
    title: "Добавить новый элемент",
    fields: [
      {
        name: "Название элемента:",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {
          placeholder: "Впишите названия элемента",
          name: "name",
        },
        attrs: {
          name: "name",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
      {
        name: "Значение нового поля: ",
        component: SelectCustomField,
        disable: false,
        syncLocalStorage: true,
        props: {
          items: [
            {
              text: "Текстовое поле",
              value: TypeComponentFields.Text as string,
            },
            {
              text: "Чекбокс",
              value: TypeComponentFields.Checkbox as string,
            },
            {
              text: "Список",
              value: TypeComponentFields.List as string,
            },
          ],
          placeholder: "Выберите тип поля",
          name: "custom_field",
        },
        attrs: {
          name: "custom_field",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          },
        ],
        interceptorParams,
      },
    ],
  },
  editFileMeta: {
    title: "Редактировать медиа-файл",
    fields: [
      {
        name: "Наименование",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        attrs: {
          name: 'name'
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения"
          }
        ],
        interceptorParams
      }
    ]
  },
  addFolder: {
    title: "Добавить новую папку",
    fields: [
      {
        name: "Название папки",
        type: TypeComponentFields.Text,
        component: BaseFieldText,
        disable: false,
        syncLocalStorage: true,
        props: {},
        attrs: {
          placeholder: "Название папки",
          name: "name",
        },
        validate: [
          {
            checkValid: (val) => !isEmpty(val),
            error_message: () => "Поле обязательно для заполнения",
          }
        ],
        interceptorParams,
      }
    ],
  },
};
