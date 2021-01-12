export async function onCreateFieldMarkdown(useService, params) {
    console.log(Object.keys(params).length);
    const result = await useService.createMarkdown(params);
    return result;
  }
  export async function onUpdateFieldMarkdown(useService, params) {
    const result = await useService.updateMarkdown(params);
    return result;
  }
  export async function onDeleteFieldMarkdown(useService, { id }) {
    const result = await useService.deleteMarkdown(id);
    return result;
  }
  export async function onGetFieldMarkdown(useService, { id }) {
    const result = await useService.getMarkdown(id);
    return result;
  }
  