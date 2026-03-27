const defaultThumbnail = '/assets/produce/apple.svg';

export function createDefaultForm() {
  return {
    name: '',
    groupId: '',
    thumbnail: defaultThumbnail,
    sectionName: '',
    sampleItemName: '',
  };
}

export function formatCategoryForList(category = {}) {
  return {
    ...category,
    sectionName: category.children?.[0]?.name || '',
    sampleItemName: category.children?.[0]?.children?.[0]?.name || '',
    goodsCountText: '',
  };
}

export function formatCategoryForForm(category = {}) {
  const form = createDefaultForm();
  return {
    ...form,
    name: category.name || '',
    groupId: category.groupId || '',
    thumbnail: category.thumbnail || form.thumbnail,
    sectionName: category.children?.[0]?.name || '',
    sampleItemName: category.children?.[0]?.children?.[0]?.name || '',
  };
}

export function buildCategoryPayload(form = {}) {
  return {
    name: `${form.name || ''}`.trim(),
    groupId: `${form.groupId || ''}`.trim(),
    thumbnail: `${form.thumbnail || ''}`.trim() || defaultThumbnail,
    sectionName: `${form.sectionName || ''}`.trim(),
    sampleItemName: `${form.sampleItemName || ''}`.trim(),
  };
}
