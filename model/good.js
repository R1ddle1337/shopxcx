const detailFarm = '/assets/produce/detail-farm.svg';
const detailDelivery = '/assets/produce/detail-delivery.svg';

const clone = (value) => JSON.parse(JSON.stringify(value));

const buildSku = ({
  skuId,
  skuImage,
  specInfo,
  salePrice,
  linePrice,
  stockQuantity,
  weight,
}) => ({
  skuId,
  skuImage,
  specInfo,
  priceInfo: [
    { priceType: 1, price: `${salePrice}`, priceTypeName: '销售价' },
    { priceType: 2, price: `${linePrice}`, priceTypeName: '划线价' },
  ],
  stockInfo: {
    stockQuantity,
    safeStockQuantity: 0,
    soldQuantity: 0,
  },
  weight: { value: weight, unit: 'KG' },
  volume: null,
  profitPrice: null,
});

const allGoods = [
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '1001',
    title: '云南阳光苹果礼盒',
    primaryImage: '/assets/produce/apple.svg',
    images: ['/assets/produce/apple.svg', detailFarm, detailDelivery],
    video: null,
    available: 1,
    isAvailable: 1,
    minSalePrice: '3980',
    minLinePrice: '4680',
    maxSalePrice: '6980',
    maxLinePrice: '7980',
    spuStockQuantity: 124,
    soldNum: 842,
    isPutOnSale: 1,
    isSoldOut: false,
    categoryIds: ['fruit', 'gift-box'],
    groupIdList: ['fruit', 'gift-box'],
    specList: [
      {
        specId: '1001-spec-1',
        title: '规格',
        specValueList: [
          { specValueId: '1001-spec-1-a', specId: '1001-spec-1', specValue: '家庭装 2.5kg', image: '' },
          { specValueId: '1001-spec-1-b', specId: '1001-spec-1', specValue: '分享装 5kg', image: '' },
        ],
      },
      {
        specId: '1001-spec-2',
        title: '口感',
        specValueList: [
          { specValueId: '1001-spec-2-a', specId: '1001-spec-2', specValue: '清甜脆口', image: '' },
          { specValueId: '1001-spec-2-b', specId: '1001-spec-2', specValue: '高甜多汁', image: '' },
        ],
      },
    ],
    skuList: [
      buildSku({
        skuId: '1001-01',
        skuImage: '/assets/produce/apple.svg',
        salePrice: 3980,
        linePrice: 4680,
        stockQuantity: 36,
        weight: 2.5,
        specInfo: [
          { specId: '1001-spec-1', specTitle: '规格', specValueId: '1001-spec-1-a', specValue: '家庭装 2.5kg' },
          { specId: '1001-spec-2', specTitle: '口感', specValueId: '1001-spec-2-a', specValue: '清甜脆口' },
        ],
      }),
      buildSku({
        skuId: '1001-02',
        skuImage: '/assets/produce/apple.svg',
        salePrice: 4380,
        linePrice: 4980,
        stockQuantity: 32,
        weight: 2.5,
        specInfo: [
          { specId: '1001-spec-1', specTitle: '规格', specValueId: '1001-spec-1-a', specValue: '家庭装 2.5kg' },
          { specId: '1001-spec-2', specTitle: '口感', specValueId: '1001-spec-2-b', specValue: '高甜多汁' },
        ],
      }),
      buildSku({
        skuId: '1001-03',
        skuImage: '/assets/produce/apple.svg',
        salePrice: 6580,
        linePrice: 7580,
        stockQuantity: 30,
        weight: 5,
        specInfo: [
          { specId: '1001-spec-1', specTitle: '规格', specValueId: '1001-spec-1-b', specValue: '分享装 5kg' },
          { specId: '1001-spec-2', specTitle: '口感', specValueId: '1001-spec-2-a', specValue: '清甜脆口' },
        ],
      }),
      buildSku({
        skuId: '1001-04',
        skuImage: '/assets/produce/apple.svg',
        salePrice: 6980,
        linePrice: 7980,
        stockQuantity: 26,
        weight: 5,
        specInfo: [
          { specId: '1001-spec-1', specTitle: '规格', specValueId: '1001-spec-1-b', specValue: '分享装 5kg' },
          { specId: '1001-spec-2', specTitle: '口感', specValueId: '1001-spec-2-b', specValue: '高甜多汁' },
        ],
      }),
    ],
    spuTagList: [{ id: 'fresh-fruit', title: '当季鲜果', image: null }],
    limitInfo: [{ text: '限购 3 件' }],
    spuLimitList: null,
    promotionList: null,
    minProfitPrice: null,
    desc: [detailFarm, detailDelivery],
    etitle: '',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '1002',
    title: '广西沃柑鲜果箱',
    primaryImage: '/assets/produce/citrus.svg',
    images: ['/assets/produce/citrus.svg', detailFarm, detailDelivery],
    video: null,
    available: 1,
    isAvailable: 1,
    minSalePrice: '2980',
    minLinePrice: '3680',
    maxSalePrice: '4980',
    maxLinePrice: '5680',
    spuStockQuantity: 138,
    soldNum: 1260,
    isPutOnSale: 1,
    isSoldOut: false,
    categoryIds: ['fruit', 'citrus'],
    groupIdList: ['fruit', 'citrus'],
    specList: [
      {
        specId: '1002-spec-1',
        title: '规格',
        specValueList: [
          { specValueId: '1002-spec-1-a', specId: '1002-spec-1', specValue: '轻享装 3kg', image: '' },
          { specValueId: '1002-spec-1-b', specId: '1002-spec-1', specValue: '囤货装 5kg', image: '' },
        ],
      },
      {
        specId: '1002-spec-2',
        title: '甜度',
        specValueList: [
          { specValueId: '1002-spec-2-a', specId: '1002-spec-2', specValue: '标准甜', image: '' },
          { specValueId: '1002-spec-2-b', specId: '1002-spec-2', specValue: '高甜爆汁', image: '' },
        ],
      },
    ],
    skuList: [
      buildSku({
        skuId: '1002-01',
        skuImage: '/assets/produce/citrus.svg',
        salePrice: 2980,
        linePrice: 3680,
        stockQuantity: 42,
        weight: 3,
        specInfo: [
          { specId: '1002-spec-1', specTitle: '规格', specValueId: '1002-spec-1-a', specValue: '轻享装 3kg' },
          { specId: '1002-spec-2', specTitle: '甜度', specValueId: '1002-spec-2-a', specValue: '标准甜' },
        ],
      }),
      buildSku({
        skuId: '1002-02',
        skuImage: '/assets/produce/citrus.svg',
        salePrice: 3380,
        linePrice: 3980,
        stockQuantity: 36,
        weight: 3,
        specInfo: [
          { specId: '1002-spec-1', specTitle: '规格', specValueId: '1002-spec-1-a', specValue: '轻享装 3kg' },
          { specId: '1002-spec-2', specTitle: '甜度', specValueId: '1002-spec-2-b', specValue: '高甜爆汁' },
        ],
      }),
      buildSku({
        skuId: '1002-03',
        skuImage: '/assets/produce/citrus.svg',
        salePrice: 4580,
        linePrice: 5380,
        stockQuantity: 34,
        weight: 5,
        specInfo: [
          { specId: '1002-spec-1', specTitle: '规格', specValueId: '1002-spec-1-b', specValue: '囤货装 5kg' },
          { specId: '1002-spec-2', specTitle: '甜度', specValueId: '1002-spec-2-a', specValue: '标准甜' },
        ],
      }),
      buildSku({
        skuId: '1002-04',
        skuImage: '/assets/produce/citrus.svg',
        salePrice: 4980,
        linePrice: 5680,
        stockQuantity: 26,
        weight: 5,
        specInfo: [
          { specId: '1002-spec-1', specTitle: '规格', specValueId: '1002-spec-1-b', specValue: '囤货装 5kg' },
          { specId: '1002-spec-2', specTitle: '甜度', specValueId: '1002-spec-2-b', specValue: '高甜爆汁' },
        ],
      }),
    ],
    spuTagList: [{ id: 'hot-citrus', title: '爆款直发', image: null }],
    limitInfo: [{ text: '限购 5 件' }],
    spuLimitList: null,
    promotionList: null,
    minProfitPrice: null,
    desc: [detailFarm, detailDelivery],
    etitle: '',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '1003',
    title: '有机西兰花组合',
    primaryImage: '/assets/produce/broccoli.svg',
    images: ['/assets/produce/broccoli.svg', detailFarm, detailDelivery],
    video: null,
    available: 1,
    isAvailable: 1,
    minSalePrice: '1690',
    minLinePrice: '2090',
    maxSalePrice: '2990',
    maxLinePrice: '3590',
    spuStockQuantity: 164,
    soldNum: 516,
    isPutOnSale: 1,
    isSoldOut: false,
    categoryIds: ['vegetable', 'leafy'],
    groupIdList: ['vegetable', 'leafy'],
    specList: [
      {
        specId: '1003-spec-1',
        title: '规格',
        specValueList: [
          { specValueId: '1003-spec-1-a', specId: '1003-spec-1', specValue: '鲜采装 2 颗', image: '' },
          { specValueId: '1003-spec-1-b', specId: '1003-spec-1', specValue: '家庭装 4 颗', image: '' },
        ],
      },
      {
        specId: '1003-spec-2',
        title: '净菜',
        specValueList: [
          { specValueId: '1003-spec-2-a', specId: '1003-spec-2', specValue: '原棵带叶', image: '' },
          { specValueId: '1003-spec-2-b', specId: '1003-spec-2', specValue: '净切方便装', image: '' },
        ],
      },
    ],
    skuList: [
      buildSku({
        skuId: '1003-01',
        skuImage: '/assets/produce/broccoli.svg',
        salePrice: 1690,
        linePrice: 2090,
        stockQuantity: 44,
        weight: 1,
        specInfo: [
          { specId: '1003-spec-1', specTitle: '规格', specValueId: '1003-spec-1-a', specValue: '鲜采装 2 颗' },
          { specId: '1003-spec-2', specTitle: '净菜', specValueId: '1003-spec-2-a', specValue: '原棵带叶' },
        ],
      }),
      buildSku({
        skuId: '1003-02',
        skuImage: '/assets/produce/broccoli.svg',
        salePrice: 1890,
        linePrice: 2290,
        stockQuantity: 40,
        weight: 1,
        specInfo: [
          { specId: '1003-spec-1', specTitle: '规格', specValueId: '1003-spec-1-a', specValue: '鲜采装 2 颗' },
          { specId: '1003-spec-2', specTitle: '净菜', specValueId: '1003-spec-2-b', specValue: '净切方便装' },
        ],
      }),
      buildSku({
        skuId: '1003-03',
        skuImage: '/assets/produce/broccoli.svg',
        salePrice: 2690,
        linePrice: 3290,
        stockQuantity: 42,
        weight: 2,
        specInfo: [
          { specId: '1003-spec-1', specTitle: '规格', specValueId: '1003-spec-1-b', specValue: '家庭装 4 颗' },
          { specId: '1003-spec-2', specTitle: '净菜', specValueId: '1003-spec-2-a', specValue: '原棵带叶' },
        ],
      }),
      buildSku({
        skuId: '1003-04',
        skuImage: '/assets/produce/broccoli.svg',
        salePrice: 2990,
        linePrice: 3590,
        stockQuantity: 38,
        weight: 2,
        specInfo: [
          { specId: '1003-spec-1', specTitle: '规格', specValueId: '1003-spec-1-b', specValue: '家庭装 4 颗' },
          { specId: '1003-spec-2', specTitle: '净菜', specValueId: '1003-spec-2-b', specValue: '净切方便装' },
        ],
      }),
    ],
    spuTagList: [{ id: 'today-picked', title: '今日现摘', image: null }],
    limitInfo: [{ text: '限购 6 件' }],
    spuLimitList: null,
    promotionList: null,
    minProfitPrice: null,
    desc: [detailFarm, detailDelivery],
    etitle: '',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '1004',
    title: '沙瓤番茄组合装',
    primaryImage: '/assets/produce/tomato.svg',
    images: ['/assets/produce/tomato.svg', detailFarm, detailDelivery],
    video: null,
    available: 1,
    isAvailable: 1,
    minSalePrice: '1990',
    minLinePrice: '2590',
    maxSalePrice: '3590',
    maxLinePrice: '4390',
    spuStockQuantity: 152,
    soldNum: 688,
    isPutOnSale: 1,
    isSoldOut: false,
    categoryIds: ['vegetable', 'tomato'],
    groupIdList: ['vegetable', 'tomato'],
    specList: [
      {
        specId: '1004-spec-1',
        title: '规格',
        specValueList: [
          { specValueId: '1004-spec-1-a', specId: '1004-spec-1', specValue: '轻食装 2kg', image: '' },
          { specValueId: '1004-spec-1-b', specId: '1004-spec-1', specValue: '家用装 4kg', image: '' },
        ],
      },
      {
        specId: '1004-spec-2',
        title: '熟度',
        specValueList: [
          { specValueId: '1004-spec-2-a', specId: '1004-spec-2', specValue: '鲜摘爽口', image: '' },
          { specValueId: '1004-spec-2-b', specId: '1004-spec-2', specValue: '沙瓤多汁', image: '' },
        ],
      },
    ],
    skuList: [
      buildSku({
        skuId: '1004-01',
        skuImage: '/assets/produce/tomato.svg',
        salePrice: 1990,
        linePrice: 2590,
        stockQuantity: 40,
        weight: 2,
        specInfo: [
          { specId: '1004-spec-1', specTitle: '规格', specValueId: '1004-spec-1-a', specValue: '轻食装 2kg' },
          { specId: '1004-spec-2', specTitle: '熟度', specValueId: '1004-spec-2-a', specValue: '鲜摘爽口' },
        ],
      }),
      buildSku({
        skuId: '1004-02',
        skuImage: '/assets/produce/tomato.svg',
        salePrice: 2190,
        linePrice: 2790,
        stockQuantity: 36,
        weight: 2,
        specInfo: [
          { specId: '1004-spec-1', specTitle: '规格', specValueId: '1004-spec-1-a', specValue: '轻食装 2kg' },
          { specId: '1004-spec-2', specTitle: '熟度', specValueId: '1004-spec-2-b', specValue: '沙瓤多汁' },
        ],
      }),
      buildSku({
        skuId: '1004-03',
        skuImage: '/assets/produce/tomato.svg',
        salePrice: 3290,
        linePrice: 3990,
        stockQuantity: 40,
        weight: 4,
        specInfo: [
          { specId: '1004-spec-1', specTitle: '规格', specValueId: '1004-spec-1-b', specValue: '家用装 4kg' },
          { specId: '1004-spec-2', specTitle: '熟度', specValueId: '1004-spec-2-a', specValue: '鲜摘爽口' },
        ],
      }),
      buildSku({
        skuId: '1004-04',
        skuImage: '/assets/produce/tomato.svg',
        salePrice: 3590,
        linePrice: 4390,
        stockQuantity: 36,
        weight: 4,
        specInfo: [
          { specId: '1004-spec-1', specTitle: '规格', specValueId: '1004-spec-1-b', specValue: '家用装 4kg' },
          { specId: '1004-spec-2', specTitle: '熟度', specValueId: '1004-spec-2-b', specValue: '沙瓤多汁' },
        ],
      }),
    ],
    spuTagList: [{ id: 'origin-direct', title: '产地直发', image: null }],
    limitInfo: [{ text: '限购 4 件' }],
    spuLimitList: null,
    promotionList: null,
    minProfitPrice: null,
    desc: [detailFarm, detailDelivery],
    etitle: '',
  },
];

export function getAllGoods() {
  return clone(allGoods);
}

export function getGoodById(id) {
  const target = allGoods.find((item) => item.spuId === `${id}`);
  return target ? clone(target) : null;
}

export function genGood(id, available = 1) {
  const matched = allGoods.find((item) => item.spuId === `${id}`);
  const fallback = allGoods[Math.abs(Number(id) || 0) % allGoods.length];
  const item = clone(matched || fallback);
  item.available = available;
  item.isAvailable = available;
  item.images = item.images?.length ? item.images : [item.primaryImage];
  item.desc = item.desc?.length ? item.desc : [detailFarm, detailDelivery];
  return item;
}
