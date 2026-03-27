import { mockIp, mockReqId } from '../utils/mock';

export function genCartGroupData() {
  const goodsPromotionList = [
    {
      uid: '88888888205468',
      saasId: '88888888',
      storeId: '1000',
      spuId: '3',
      skuId: '135691622',
      isSelected: 1,
      thumb: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
      title: '春季简约连衣裙',
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
      quantity: 1,
      stockStatus: true,
      stockQuantity: 12,
      price: '29800',
      originPrice: '35800',
      tagPrice: null,
      titlePrefixTags: [{ text: '新品' }],
      roomId: null,
      specInfo: [
        {
          specTitle: '颜色',
          specValue: '米白',
        },
        {
          specTitle: '尺码',
          specValue: 'M',
        },
      ],
      joinCartTime: '2020-06-29T07:55:27.000+0000',
      available: 1,
      putOnSale: 1,
      etitle: null,
    },
    {
      uid: '88888888205469',
      saasId: '88888888',
      storeId: '1000',
      spuId: '5',
      skuId: '135691635',
      isSelected: 1,
      thumb: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-2a.png',
      title: '轻量蓝牙耳机',
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-2a.png',
      quantity: 1,
      stockStatus: true,
      stockQuantity: 24,
      price: '29000',
      originPrice: '32900',
      tagPrice: null,
      titlePrefixTags: [{ text: '热卖' }],
      roomId: null,
      specInfo: [
        {
          specTitle: '颜色',
          specValue: '曜石黑',
        },
        {
          specTitle: '版本',
          specValue: '标准版',
        },
      ],
      joinCartTime: '2020-06-29T07:55:17.000+0000',
      available: 1,
      putOnSale: 1,
      etitle: null,
    },
  ];

  const totalAmount = goodsPromotionList
    .reduce((sum, goods) => sum + Number(goods.price) * goods.quantity, 0)
    .toString();
  const totalDiscountAmount = goodsPromotionList
    .reduce((sum, goods) => sum + (Number(goods.originPrice) - Number(goods.price)) * goods.quantity, 0)
    .toString();
  const selectedGoodsCount = goodsPromotionList.reduce((sum, goods) => sum + goods.quantity, 0);

  return {
    data: {
      isNotEmpty: true,
      storeGoods: [
        {
          storeId: '1000',
          storeName: 'Mall 官方示例店',
          storeStatus: 1,
          totalDiscountSalePrice: totalDiscountAmount,
          promotionGoodsList: [
            {
              title: null,
              promotionCode: 'EMPTY_PROMOTION',
              promotionSubCode: null,
              promotionId: null,
              tagText: null,
              promotionStatus: null,
              tag: null,
              description: null,
              doorSillRemain: null,
              isNeedAddOnShop: 0,
              goodsPromotionList,
              lastJoinTime: null,
            },
          ],
          lastJoinTime: goodsPromotionList[0].joinCartTime,
          postageFreePromotionVo: {
            title: null,
            promotionCode: null,
            promotionSubCode: null,
            promotionId: null,
            tagText: null,
            promotionStatus: null,
            tag: null,
            description: null,
            doorSillRemain: null,
            isNeedAddOnShop: 0,
          },
        },
      ],
      invalidGoodItems: [],
      isAllSelected: true,
      selectedGoodsCount,
      totalAmount,
      totalDiscountAmount,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 269,
    success: true,
  };
}
