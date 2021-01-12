export interface DBModel<T> {
  nameTable?: string;
  create: (nameTable, payloadModel: T) => Promise<any>;
  connect: (hostname?: string, port?: number) => Promise<any>;
}

export interface EntityModel {
  id: string;
  name: string;
  description?: string;
  seo?: SeoModel;
  status: string;
  group_id: string;
  models?: Array<ModelEntityModel>;
  list_id?: string;
}
export interface MarkdownModel {
  id: string;
  html?: string;
  date_created?: string;
  date_last_updated?: string;
  type: string;
  entity_id?: string;
  model_id?: string;
  required: boolean;
  name: string;
  list_id?: string;
}
export interface GroupEntityModel {
  id: string;
  name: string;
  description?: string;
  hasSeo: boolean;
  title: string;
}
export interface FieldTextModel {
  id: string;
  content: string;
  placeholder?: string;
  required: boolean;
  icon: string;
  date_created: Date;
  date_last_updated: Date;
  list_id?: string;
  model_id?: string
  type?: string;
  readonly entity_id: string;
}
export interface FieldListModel {
  id: string;
  name: string;
  title: string;
  required: boolean;
  date_created: Date;
  date_last_updated: Date;
  model_id?: string;
  type?: string;
  readonly entity_id: string;
}
export interface FieldListItemModel {
  id: string;
  name: string;
  description: string;
  date_created: Date;
  date_last_updated: Date;
  placeholder?: string;
  readonly list_id: string;
}
export interface FieldCheckboxModel {
  id: string;
  name: string;
  title: string;
  date_created: Date;
  date_last_updated: Date;
  is_checked: boolean;
  list_id?: string;
  model_id?: string;
  type?: string;
  readonly entity_id: string;
}
export interface ModelEntityModel {
  id: string;
  title: string;
  name: string;
  description: string;
  date_created?: string;
  date_last_updated?: string;
  fields?: Array<FieldModel>;
}
export interface SeoModel {
  id: string;
  title: string;
  description?: string;
  keywords?: string;
  date_created: Date;
  date_last_updated: Date;
  "og:image"?: string;
  "og:title"?: string;
  "og:url"?: string;
  "og:type"?: string;
  "og:description"?: string;
  "og:site_name"?: string;
  "twitter:image"?: string;
  "twitter:title"?: string;
  "twitter:url"?: string;
  "twitter:type"?: string;
  "twitter:description"?: string;
  "twitter:site_name"?: string;
  "fb:image"?: string;
  "fb:title"?: string;
  "fb:url"?: string;
  "fb:type"?: string;
  "fb:description"?: string;
  "fb:site_name"?: string;
  readonly entity_id: string;
}
export interface UsersModel {
  id: string;
  first_name?: string;
  last_name?: string;
  third_name?: string;
  email?: string;
  avatar?: MediaModel;
  nickname: string;
  github?: string;
  password: string;
  date_created: Date;
  date_last_updated: Date;
  readonly role: number;
}
export interface RoleModel {
  id: number;
  name: string;
  readonly access_write: boolean;
  readonly access_read: boolean;
  readonly access_create_users: boolean;
}
export interface MediaModel {
  id: number;
  alternative: string;
  title: string;
  name: string;
  lazy?: boolean;
  date_created?: Date;
  date_last_updated?: Date;
  extension?: string;
  fullname?: string;
  relative_path?: string;
}
export interface FieldModel extends FieldTextModel, FieldCheckboxModel, FieldListModel {

}
export interface EntityWithFieldsModel extends EntityModel {
  fields: FieldModel[];
}