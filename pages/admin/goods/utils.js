const defaultCategoryOptions = [
  { label: '鲜果', value: 'fruit' },
  { label: '时蔬', value: 'vegetable' },
];

const trimValue = (value) => `${value ?? ''}`.trim();

const splitLines = (value) =>
  Array.from(
    new Set(
      `${value || ''}`
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

export function getCategoryOptions(list = []) {
  const options = (list || [])
    .map((item) => ({
      label: item.name,
      value: item.groupId,
    }))
    .filter((item) => item.label && item.value);

  return options.length ? options : defaultCategoryOptions;
}

export function getDefaultImageByCategory(categoryId) {
  return categoryId === 'vegetable' ? '/assets/produce/tomato.svg' : '/assets/produce/apple.svg';
}

export function createSkuItem(overrides = {}) {
  return {
    skuId: '',
    specValueId: '',
    specValue: '',
    salePrice: '',
    linePrice: '',
    stockQuantity: '',
    weight: '',
    skuImage: '',
    ...overrides,
  };
}

export function createDefaultForm() {
  return {
    title: '',
    categoryId: 'fruit',
    primaryImage: getDefaultImageByCategory('fruit'),
    tagTitle: '',
    limitText: '',
    soldNum: '0',
    isPutOnSale: true,
    specId: '',
    carouselImagesText: '',
    detailImagesText: '',
    skuItems: [createSkuItem({ specValue: '默认规格', salePrice: '0.00', linePrice: '0.00', stockQuantity: '0', weight: '1' })],
  };
}

export function formatFenToYuan(value) {
  return (Number(value || 0) / 100).toFixed(2);
}

export function formatGoodForForm(good = {}) {
  const form = createDefaultForm();
  const specId = good.specList?.[0]?.specId || '';
  const skuItems =
    (good.skuList || []).map((item, index) => {
      const specInfo = item.specInfo?.[0] || {};
      const salePrice = item.priceInfo?.find((price) => price.priceType === 1)?.price || 0;
      const linePrice = item.priceInfo?.find((price) => price.priceType === 2)?.price || salePrice;
      return createSkuItem({
        skuId: item.skuId,
        specValueId: specInfo.specValueId || `${specId}-${index + 1}`,
        specValue: specInfo.specValue || `规格${index + 1}`,
        salePrice: formatFenToYuan(salePrice),
        linePrice: formatFenToYuan(linePrice),
        stockQuantity: `${item.stockInfo?.stockQuantity ?? 0}`,
        weight: `${item.weight?.value ?? 1}`,
        skuImage: item.skuImage || good.primaryImage || '',
      });
    }) || [];

  return {
    ...form,
    title: good.title || '',
    categoryId: good.categoryIds?.[0] || form.categoryId,
    primaryImage: good.primaryImage || form.primaryImage,
    tagTitle: good.spuTagList?.[0]?.title || '',
    limitText: good.limitInfo?.[0]?.text || '',
    soldNum: `${good.soldNum ?? 0}`,
    isPutOnSale: good.isPutOnSale !== 0,
    specId,
    carouselImagesText: (good.images || []).join('\n'),
    detailImagesText: (good.desc || []).join('\n'),
    skuItems: skuItems.length ? skuItems : form.skuItems,
  };
}

export function formatGoodForList(good = {}, categoryMap = {}) {
  const skuList = good.skuList || [];
  return {
    ...good,
    categoryName: categoryMap[good.categoryIds?.[0]] || good.categoryIds?.[0] || '未分类',
    tagTitle: good.spuTagList?.[0]?.title || '',
    minSalePriceText: formatFenToYuan(good.minSalePrice || 0),
    maxLinePriceText: formatFenToYuan(good.maxLinePrice || 0),
    stockText: `${good.spuStockQuantity || 0}`,
    skuCountText: `${skuList.length}`,
  };
}

const yuanToFen = (value) => Math.round(Number(value || 0) * 100);

export function buildGoodPayload(form) {
  const categoryId = trimValue(form.categoryId) || 'fruit';
  const primaryImage = trimValue(form.primaryImage) || getDefaultImageByCategory(categoryId);
  const images = splitLines(form.carouselImagesText);
  const desc = splitLines(form.detailImagesText);

  return {
    title: trimValue(form.title),
    categoryId,
    primaryImage,
    tagTitle: trimValue(form.tagTitle),
    limitText: trimValue(form.limitText),
    soldNum: Number(form.soldNum || 0),
    isPutOnSale: form.isPutOnSale ? 1 : 0,
    specId: trimValue(form.specId),
    images: images.length ? images : [primaryImage],
    desc,
    skuItems: (form.skuItems || []).map((item, index) => ({
      skuId: trimValue(item.skuId),
      specValueId: trimValue(item.specValueId),
      specValue: trimValue(item.specValue) || `规格${index + 1}`,
      salePrice: yuanToFen(item.salePrice),
      linePrice: yuanToFen(item.linePrice || item.salePrice),
      stockQuantity: Number(item.stockQuantity || 0),
      weight: Number(item.weight || 0),
      skuImage: trimValue(item.skuImage) || primaryImage,
    })),
  };
}

export function getCategoryIndex(options = [], value = '') {
  const index = options.findIndex((item) => item.value === value);
  return index > -1 ? index : 0;
}
