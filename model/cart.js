import { mockIp, mockReqId } from '../utils/mock';
import { getGoodById } from './good';
import { STORE_NAME } from './store';

const buildCartGoods = ({ spuId, skuIndex = 0, quantity = 1, isSelected = 1 }) => {
  const good = getGoodById(spuId);
  const sku = good.skuList[skuIndex];
  const salePrice = sku.priceInfo.find((item) => item.priceType === 1)?.price || good.minSalePrice;
  const linePrice = sku.priceInfo.find((item) => item.priceType === 2)?.price || good.maxLinePrice;

  return {
    uid: `${sku.skuId}-uid`,
    saasId: good.saasId,
    storeId: good.storeId,
    spuId: good.spuId,
    skuId: sku.skuId,
    isSelected,
    thumb: good.primaryImage,
    title: good.title,
    primaryImage: good.primaryImage,
    quantity,
    stockStatus: true,
    stockQuantity: sku.stockInfo.stockQuantity,
    price: `${salePrice}`,
    originPrice: `${linePrice}`,
    tagPrice: null,
    titlePrefixTags: good.spuTagList.map((item) => ({ text: item.title })),
    roomId: null,
    specInfo: sku.specInfo,
    joinCartTime: '2026-03-27T07:55:17.000+0000',
    available: 1,
    putOnSale: 1,
    etitle: null,
  };
};

export function genCartGroupData() {
  const goodsPromotionList = [
    buildCartGoods({ spuId: '1001', skuIndex: 0, quantity: 1, isSelected: 1 }),
    buildCartGoods({ spuId: '1003', skuIndex: 1, quantity: 2, isSelected: 1 }),
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
          storeName: STORE_NAME,
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
