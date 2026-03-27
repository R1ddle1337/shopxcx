const http = require('node:http');
const { URL } = require('node:url');
const { ensureDataFile, readState, updateState, getCurrentUserId, dataFilePath } = require('./store');
const {
  STORE_NAME,
  STORE_SERVICE_PHONE,
  STORE_SERVICE_TIME,
  detailFarm,
  detailDelivery,
  buildSku,
  findSku,
  getSalePrice,
  getLinePrice,
  buildOrder,
  buildTrajectory,
} = require('./seed');

const PORT = Number(process.env.PORT || 3007);

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  });
  res.end(JSON.stringify(data));
};

const ok = (res, data, statusCode = 200) => sendJson(res, statusCode, data);
const fail = (res, statusCode, message) => sendJson(res, statusCode, { code: 'Error', success: false, msg: message });

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });

const getCtx = (req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return {
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
  };
};

const getUser = (state, req) => state.users.find((item) => item.id === getCurrentUserId(req)) || state.users[0];
const getAddresses = (state, userId) => state.addresses.filter((item) => item.uid === userId);
const getDefaultAddress = (state, userId) => getAddresses(state, userId).find((item) => item.isDefault === 1) || getAddresses(state, userId)[0] || null;

const toGoodsCard = (good) => ({
  spuId: good.spuId,
  skuId: good.skuList[0].skuId,
  storeId: good.storeId,
  thumb: good.primaryImage,
  title: good.title,
  price: good.minSalePrice,
  originPrice: good.maxLinePrice,
  tags: good.spuTagList.map((tag) => tag.title),
});

const searchGoods = (state, query = {}) => {
  let list = [...state.goods];
  const keyword = `${query.keyword || ''}`.trim();
  if (keyword) {
    list = list.filter((item) => item.title.includes(keyword) || item.spuTagList.some((tag) => tag.title.includes(keyword)));
  }
  if (query.minPrice) {
    list = list.filter((item) => Number(item.minSalePrice) >= Number(query.minPrice));
  }
  if (query.maxPrice) {
    list = list.filter((item) => Number(item.minSalePrice) <= Number(query.maxPrice));
  }
  if (Number(query.sort) === 1) {
    list.sort((prev, next) => {
      const diff = Number(prev.minSalePrice) - Number(next.minSalePrice);
      return Number(query.sortType || 0) === 1 ? -diff : diff;
    });
  }
  return list;
};

const buildSearchResponse = (state, query) => {
  const pageNum = Number(query.pageNum || 1);
  const pageSize = Number(query.pageSize || 30);
  const list = searchGoods(state, query);
  const pageList = list.slice((pageNum - 1) * pageSize, pageNum * pageSize);

  return {
    spuList: pageList.map((item) => ({
      ...item,
      skuId: item.skuList[0]?.skuId,
      thumb: item.primaryImage,
      price: item.minSalePrice,
      originPrice: item.maxLinePrice,
      desc: '',
      tags: item.spuTagList.map((tag) => ({ title: tag.title })),
    })),
    totalCount: list.length,
  };
};

const buildCartResponse = (state, userId) => {
  const goodsPromotionList = state.cartItems
    .filter((item) => item.userId === userId)
    .map((item) => {
      const good = state.goods.find((goodsItem) => goodsItem.spuId === item.spuId);
      const sku = findSku(good, item.skuId);
      if (!good || !sku) return null;
      return {
        uid: `${sku.skuId}-uid`,
        saasId: good.saasId,
        storeId: good.storeId,
        spuId: good.spuId,
        skuId: sku.skuId,
        isSelected: item.isSelected,
        thumb: good.primaryImage,
        title: good.title,
        primaryImage: good.primaryImage,
        quantity: item.quantity,
        stockStatus: true,
        stockQuantity: sku.stockInfo.stockQuantity,
        price: `${getSalePrice(sku)}`,
        originPrice: `${getLinePrice(sku)}`,
        tagPrice: null,
        titlePrefixTags: good.spuTagList.map((tag) => ({ text: tag.title })),
        roomId: null,
        specInfo: sku.specInfo,
        joinCartTime: item.joinCartTime,
        available: 1,
        putOnSale: 1,
      };
    })
    .filter(Boolean);

  const selectedList = goodsPromotionList.filter((item) => item.isSelected === 1);
  const totalAmount = selectedList.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toString();
  const totalDiscountAmount = selectedList
    .reduce((sum, item) => sum + (Number(item.originPrice) - Number(item.price)) * item.quantity, 0)
    .toString();
  const selectedGoodsCount = selectedList.reduce((sum, item) => sum + item.quantity, 0);

  return {
    data: {
      isNotEmpty: goodsPromotionList.length > 0,
      storeGoods: goodsPromotionList.length
        ? [
            {
              storeId: '1000',
              storeName: STORE_NAME,
              storeStatus: 1,
              totalDiscountSalePrice: totalDiscountAmount,
              promotionGoodsList: [{ promotionCode: 'EMPTY_PROMOTION', goodsPromotionList }],
              postageFreePromotionVo: {},
            },
          ]
        : [],
      invalidGoodItems: [],
      isAllSelected: goodsPromotionList.length > 0 && goodsPromotionList.every((item) => item.isSelected === 1),
      selectedGoodsCount,
      totalAmount,
      totalDiscountAmount,
    },
    code: 'Success',
    success: true,
  };
};

const buildOrdersCount = (state, userId) => {
  const orders = state.orders.filter((item) => item.uid === userId);
  return [
    { tabType: 5, orderNum: orders.filter((item) => item.orderStatus === 5).length },
    { tabType: 10, orderNum: orders.filter((item) => item.orderStatus === 10).length },
    { tabType: 40, orderNum: orders.filter((item) => item.orderStatus === 40).length },
    { tabType: 50, orderNum: orders.filter((item) => item.orderStatus === 50).length },
  ];
};

const buildSettleDetail = (state, payload, userId) => {
  const { goodsRequestList = [], userAddressReq } = payload;
  const list = goodsRequestList.map((item) => ({
    storeId: item.storeId,
    spuId: item.spuId,
    skuId: item.skuId,
    goodsName: item.title || item.goodsName,
    image: item.primaryImage || item.thumb,
    reminderStock: 999,
    quantity: item.quantity,
    payPrice: item.price,
    totalSkuPrice: item.price,
    discountSettlePrice: item.price,
    realSettlePrice: item.price,
    settlePrice: item.price,
    oriPrice: item.originPrice || item.price,
    tagPrice: null,
    tagText: null,
    skuSpecLst: item.specInfo || [],
    roomId: item.roomId || null,
  }));
  const totalPrice = list.reduce((sum, item) => sum + Number(item.settlePrice) * item.quantity, 0);

  return {
    data: {
      settleType: userAddressReq || getDefaultAddress(state, userId) ? 1 : 0,
      userAddress: userAddressReq || getDefaultAddress(state, userId),
      totalGoodsCount: list.reduce((sum, item) => sum + item.quantity, 0),
      packageCount: 1,
      totalAmount: `${totalPrice}`,
      totalPayAmount: `${totalPrice}`,
      totalDiscountAmount: '0',
      totalPromotionAmount: '0',
      totalCouponAmount: '0',
      totalSalePrice: `${totalPrice}`,
      totalGoodsAmount: `${totalPrice}`,
      totalDeliveryFee: '0',
      storeGoodsList: [
        {
          storeId: '1000',
          storeName: STORE_NAME,
          goodsCount: list.length,
          deliveryFee: '0',
          storeTotalAmount: `${totalPrice}`,
          storeTotalPayAmount: `${totalPrice}`,
          storeTotalDiscountAmount: '0',
          storeTotalCouponAmount: '0',
          skuDetailVos: list,
          couponList: [],
        },
      ],
      inValidGoodsList: null,
      outOfStockGoodsList: null,
      limitGoodsList: null,
      abnormalDeliveryGoodsList: null,
      invoiceSupport: 1,
    },
    code: 'Success',
    success: true,
  };
};

const normalizeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeInteger = (value, fallback = 0) => {
  const number = Math.round(normalizeNumber(value, fallback));
  return number >= 0 ? number : 0;
};

const normalizeString = (value, fallback = '') => {
  const text = `${value ?? ''}`.trim();
  return text || fallback;
};

const normalizeFlag = (value, fallback = 1) => {
  if (value === undefined || value === null || value === '') return fallback;
  return value === true || value === 1 || value === '1' ? 1 : 0;
};

const uniqueStrings = (list = []) =>
  Array.from(
    new Set(
      list
        .map((item) => `${item || ''}`.trim())
        .filter(Boolean),
    ),
  );

const normalizeImageList = (list, fallbackList = []) => {
  const normalized = Array.isArray(list) ? uniqueStrings(list) : [];
  return normalized.length ? normalized : uniqueStrings(fallbackList);
};

const getDefaultGoodsImage = (categoryId) =>
  categoryId === 'vegetable' ? '/assets/produce/tomato.svg' : '/assets/produce/apple.svg';

const buildExistingAdminSkuItems = (good = {}) =>
  (good.skuList || []).map((item, index) => {
    const specInfo = item.specInfo?.[0] || {};
    return {
      skuId: item.skuId,
      specValueId: specInfo.specValueId || `${good.spuId}-spec-1-${index + 1}`,
      specValue: specInfo.specValue || `规格${index + 1}`,
      salePrice: getSalePrice(item),
      linePrice: getLinePrice(item),
      stockQuantity: normalizeInteger(item.stockInfo?.stockQuantity, 0),
      weight: normalizeNumber(item.weight?.value, 1),
      skuImage: item.skuImage || good.primaryImage,
    };
  });

const normalizeAdminGood = (payload = {}, currentGood = null) => {
  const spuId = currentGood?.spuId || normalizeString(payload.spuId, `${Date.now()}`);
  const categoryId = normalizeString(
    payload.categoryId || payload.categoryIds?.[0],
    currentGood?.categoryIds?.[0] || 'fruit',
  );
  const primaryImage = normalizeString(
    payload.primaryImage,
    currentGood?.primaryImage || getDefaultGoodsImage(categoryId),
  );
  const images = normalizeImageList(
    payload.images,
    currentGood?.images || [primaryImage, detailFarm, detailDelivery],
  );
  const desc = normalizeImageList(payload.desc, currentGood?.desc || [detailFarm, detailDelivery]);
  const specId = normalizeString(
    payload.specId,
    currentGood?.specList?.[0]?.specId || `${spuId}-spec-1`,
  );
  const rawSkuItems =
    Array.isArray(payload.skuItems) && payload.skuItems.length
      ? payload.skuItems
      : buildExistingAdminSkuItems(currentGood || {});
  const skuSeed =
    rawSkuItems.length > 0
      ? rawSkuItems
      : [
          {
            specValue: '默认规格',
            salePrice: 0,
            linePrice: 0,
            stockQuantity: 0,
            weight: 1,
            skuImage: primaryImage,
          },
        ];

  const skuItems = skuSeed.map((item, index) => {
    const salePrice = normalizeInteger(item.salePrice, 0);
    const linePrice = normalizeInteger(item.linePrice, salePrice);
    return {
      skuId: normalizeString(item.skuId, `${spuId}-${String(index + 1).padStart(2, '0')}`),
      specValueId: normalizeString(item.specValueId, `${specId}-${String(index + 1).padStart(2, '0')}`),
      specValue: normalizeString(item.specValue, `规格${index + 1}`),
      salePrice,
      linePrice: Math.max(linePrice, salePrice),
      stockQuantity: normalizeInteger(item.stockQuantity, 0),
      weight: normalizeNumber(item.weight, 1),
      skuImage: normalizeString(item.skuImage, primaryImage),
    };
  });

  const salePrices = skuItems.map((item) => item.salePrice);
  const linePrices = skuItems.map((item) => item.linePrice);
  const totalStock = skuItems.reduce((sum, item) => sum + item.stockQuantity, 0);
  const tagTitle = normalizeString(payload.tagTitle, currentGood?.spuTagList?.[0]?.title || '');
  const limitText = normalizeString(payload.limitText, currentGood?.limitInfo?.[0]?.text || '');
  const soldNum = normalizeInteger(payload.soldNum, currentGood?.soldNum || 0);
  const isPutOnSale = normalizeFlag(payload.isPutOnSale, currentGood?.isPutOnSale ?? 1);

  return {
    saasId: currentGood?.saasId || '88888888',
    storeId: currentGood?.storeId || '1000',
    spuId,
    title: normalizeString(payload.title, currentGood?.title || '未命名商品'),
    primaryImage,
    images: uniqueStrings([primaryImage, ...images]),
    available: 1,
    isAvailable: 1,
    minSalePrice: `${Math.min(...salePrices)}`,
    minLinePrice: `${Math.min(...linePrices)}`,
    maxSalePrice: `${Math.max(...salePrices)}`,
    maxLinePrice: `${Math.max(...linePrices)}`,
    spuStockQuantity: totalStock,
    soldNum,
    isPutOnSale,
    isSoldOut: isPutOnSale === 0 || totalStock === 0,
    categoryIds: [categoryId],
    groupIdList: [categoryId],
    specList: [
      {
        specId,
        title: '规格',
        specValueList: skuItems.map((item) => ({
          specValueId: item.specValueId,
          specId,
          specValue: item.specValue,
          image: '',
        })),
      },
    ],
    skuList: skuItems.map((item) =>
      buildSku({
        skuId: item.skuId,
        skuImage: item.skuImage,
        specInfo: [
          {
            specId,
            specTitle: '规格',
            specValueId: item.specValueId,
            specValue: item.specValue,
          },
        ],
        salePrice: item.salePrice,
        linePrice: item.linePrice,
        stockQuantity: item.stockQuantity,
        weight: item.weight,
      }),
    ),
    spuTagList: tagTitle
      ? [
          {
            id: currentGood?.spuTagList?.[0]?.id || `tag-${spuId}`,
            title: tagTitle,
            image: null,
          },
        ]
      : [],
    limitInfo: limitText ? [{ text: limitText }] : [],
    desc,
    etitle: normalizeString(payload.etitle, currentGood?.etitle || ''),
  };
};

const createOrUpdateAddress = (state, userId, payload, addressId) => {
  const nextId = addressId || payload.addressId || payload.id || `addr-${state.nextAddressSeq++}`;
  const nextAddress = {
    saasId: '88888888',
    uid: userId,
    authToken: null,
    id: nextId,
    addressId: nextId,
    phone: payload.phone,
    name: payload.name,
    countryName: payload.countryName || '中国',
    countryCode: payload.countryCode || 'chn',
    provinceName: payload.provinceName,
    provinceCode: payload.provinceCode,
    cityName: payload.cityName,
    cityCode: payload.cityCode,
    districtName: payload.districtName,
    districtCode: payload.districtCode,
    detailAddress: payload.detailAddress,
    isDefault: payload.isDefault ? 1 : 0,
    addressTag: payload.addressTag || '',
    latitude: payload.latitude || '',
    longitude: payload.longitude || '',
    storeId: null,
  };

  if (nextAddress.isDefault === 1) {
    state.addresses = state.addresses.map((item) => (item.uid === userId ? { ...item, isDefault: 0 } : item));
  }

  const index = state.addresses.findIndex((item) => item.uid === userId && item.addressId === nextId);
  if (index > -1) state.addresses[index] = nextAddress;
  else state.addresses.push(nextAddress);
  return nextAddress;
};

const createSubmittedOrder = (state, payload, userId) => {
  const now = Date.now();
  const orderNo = `FG${new Date(now).toISOString().slice(0, 10).replace(/-/g, '')}${String(state.nextOrderSeq).padStart(3, '0')}`;
  const orderId = `FGORDER${String(state.nextOrderSeq).padStart(4, '0')}`;
  const order = buildOrder({
    orderNo,
    orderId,
    status: 10,
    statusName: '待发货',
    statusRemark: '订单已支付，等待仓库分拣',
    createTime: now,
    goods: (payload.goodsRequestList || []).map((item) => ({ spuId: item.spuId, skuId: item.skuId, buyQuantity: Number(item.quantity || 1) })),
    buttons: [{ primary: true, type: 9, name: '再次购买' }],
    trajectoryVos: buildTrajectory([
      { title: '已支付', code: '200002', status: '订单已支付，等待仓库分拣', timestamp: now + 1000 },
      { title: '', code: '200001', status: '订单已提交', timestamp: now },
    ]),
    paySuccessTime: now + 1000,
    remark: (payload.storeInfoList || []).map((item) => item.remark).filter(Boolean).join('；'),
    address: payload.userAddressReq || getDefaultAddress(state, userId),
  });

  state.nextOrderSeq += 1;
  state.orders.unshift(order);
  const orderedSkuIds = new Set((payload.goodsRequestList || []).map((item) => item.skuId));
  state.cartItems = state.cartItems.filter((item) => !(item.userId === userId && orderedSkuIds.has(item.skuId)));

  return {
    data: {
      isSuccess: true,
      tradeNo: orderNo,
      payInfo: '{}',
      code: null,
      transactionId: `E-${orderId}`,
      msg: null,
      interactId: `${state.nextOrderSeq}`,
      channel: 'wechat',
      limitGoodsList: null,
    },
    code: 'Success',
    success: true,
  };
};

async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    ok(res, {});
    return;
  }

  const { pathname, query } = getCtx(req);
  const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await parseBody(req).catch(() => null) : {};
  if (body === null) {
    fail(res, 400, '请求体不是合法 JSON');
    return;
  }

  const goodsMatch = pathname.match(/^\/api\/goods\/([^/]+)$/);
  const orderMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
  const addressMatch = pathname.match(/^\/api\/addresses\/([^/]+)$/);
  const cartItemMatch = pathname.match(/^\/api\/cart\/items\/([^/]+)$/);
  const adminGoodsMatch = pathname.match(/^\/api\/admin\/goods\/([^/]+)$/);

  if (pathname === '/api/health' && req.method === 'GET') {
    ok(res, { code: 'Success', success: true, data: { service: 'fresh-garden-local-api', dataFilePath } });
    return;
  }

  if (pathname === '/api/auth/guest-login' && req.method === 'POST') {
    const state = await readState();
    ok(res, { code: 'Success', success: true, data: { userId: state.users[0].id, token: `guest-${state.users[0].id}`, userInfo: state.users[0] } });
    return;
  }

  if (pathname === '/api/categories' && req.method === 'GET') {
    ok(res, await readState().then((state) => state.categories));
    return;
  }

  if (pathname === '/api/goods/home' && req.method === 'GET') {
    const state = await readState();
    const pageIndex = Number(query.pageIndex || 0);
    const pageSize = Number(query.pageSize || 20);
    ok(res, state.goods.slice(pageIndex, pageIndex + pageSize).map((item) => toGoodsCard(item)));
    return;
  }

  if ((pathname === '/api/goods/list' || pathname === '/api/goods/search') && req.method === 'GET') {
    ok(res, await readState().then((state) => buildSearchResponse(state, query)));
    return;
  }

  if (goodsMatch && req.method === 'GET') {
    const state = await readState();
    const good = state.goods.find((item) => item.spuId === goodsMatch[1]);
    if (!good) {
      fail(res, 404, '商品不存在');
      return;
    }
    ok(res, good);
    return;
  }

  if (pathname === '/api/cart' && req.method === 'GET') {
    const state = await readState();
    ok(res, buildCartResponse(state, getCurrentUserId(req)));
    return;
  }

  if (pathname === '/api/cart/items' && req.method === 'POST') {
    const nextState = await updateState(async (draft) => {
      const userId = getCurrentUserId(req);
      const existed = draft.cartItems.find((item) => item.userId === userId && item.skuId === body.skuId);
      if (existed) existed.quantity += Number(body.quantity || 1);
      else draft.cartItems.push({ userId, spuId: body.spuId, skuId: body.skuId, quantity: Number(body.quantity || 1), isSelected: 1, joinCartTime: new Date().toISOString() });
      return draft;
    });
    ok(res, buildCartResponse(nextState, getCurrentUserId(req)));
    return;
  }

  if (cartItemMatch && req.method === 'PATCH') {
    const nextState = await updateState(async (draft) => {
      const item = draft.cartItems.find((cartItem) => cartItem.userId === getCurrentUserId(req) && cartItem.skuId === cartItemMatch[1]);
      if (!item) throw new Error('菜篮商品不存在');
      if (body.quantity !== undefined) item.quantity = Number(body.quantity);
      if (body.isSelected !== undefined) item.isSelected = body.isSelected ? 1 : 0;
      return draft;
    }).catch((error) => {
      fail(res, 400, error.message);
      return null;
    });
    if (!nextState) return;
    ok(res, buildCartResponse(nextState, getCurrentUserId(req)));
    return;
  }

  if (cartItemMatch && req.method === 'DELETE') {
    const nextState = await updateState(async (draft) => {
      draft.cartItems = draft.cartItems.filter((item) => !(item.userId === getCurrentUserId(req) && item.skuId === cartItemMatch[1]));
      return draft;
    });
    ok(res, buildCartResponse(nextState, getCurrentUserId(req)));
    return;
  }

  if (pathname === '/api/cart/store-selected' && req.method === 'PATCH') {
    const nextState = await updateState(async (draft) => {
      draft.cartItems = draft.cartItems.map((item) => (item.userId === getCurrentUserId(req) ? { ...item, isSelected: body.isSelected ? 1 : 0 } : item));
      return draft;
    });
    ok(res, buildCartResponse(nextState, getCurrentUserId(req)));
    return;
  }

  if (pathname === '/api/cart/all-selected' && req.method === 'PATCH') {
    const nextState = await updateState(async (draft) => {
      draft.cartItems = draft.cartItems.map((item) => (item.userId === getCurrentUserId(req) ? { ...item, isSelected: body.isSelected ? 1 : 0 } : item));
      return draft;
    });
    ok(res, buildCartResponse(nextState, getCurrentUserId(req)));
    return;
  }

  if (pathname === '/api/user/center' && req.method === 'GET') {
    const state = await readState();
    const user = getUser(state, req);
    const counts = buildOrdersCount(state, user.id);
    ok(res, {
      userInfo: { avatarUrl: user.avatarUrl, nickName: user.nickName, phoneNumber: user.phoneNumber, gender: user.gender },
      countsData: [{ type: 'address', num: `${getAddresses(state, user.id).length}` }],
      orderTagInfos: [
        { orderNum: counts.find((item) => item.tabType === 5)?.orderNum || 0, tabType: 5 },
        { orderNum: counts.find((item) => item.tabType === 10)?.orderNum || 0, tabType: 10 },
        { orderNum: counts.find((item) => item.tabType === 40)?.orderNum || 0, tabType: 40 },
        { orderNum: 0, tabType: 60 },
        { orderNum: 0, tabType: 0 },
      ],
      customerServiceInfo: { servicePhone: STORE_SERVICE_PHONE, serviceTimeDuration: STORE_SERVICE_TIME },
    });
    return;
  }

  if (pathname === '/api/user/person' && req.method === 'GET') {
    const state = await readState();
    const user = getUser(state, req);
    const address = getDefaultAddress(state, user.id);
    ok(res, {
      avatarUrl: user.avatarUrl,
      nickName: user.nickName,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      address: address ? { provinceName: address.provinceName, provinceCode: address.provinceCode, cityName: address.cityName, cityCode: address.cityCode } : null,
    });
    return;
  }

  if (pathname === '/api/addresses' && req.method === 'GET') {
    const state = await readState();
    ok(res, getAddresses(state, getCurrentUserId(req)).map((item) => ({ ...item, phoneNumber: item.phone, address: `${item.provinceName}${item.cityName}${item.districtName}${item.detailAddress}`, tag: item.addressTag })));
    return;
  }

  if (addressMatch && req.method === 'GET') {
    const state = await readState();
    const item = getAddresses(state, getCurrentUserId(req)).find((address) => address.addressId === addressMatch[1] || address.id === addressMatch[1]);
    if (!item) {
      fail(res, 404, '地址不存在');
      return;
    }
    ok(res, item);
    return;
  }

  if (pathname === '/api/addresses' && req.method === 'POST') {
    const nextState = await updateState(async (draft) => {
      draft.__savedAddress = createOrUpdateAddress(draft, getCurrentUserId(req), body);
      return draft;
    });
    const savedAddress = nextState.__savedAddress;
    delete nextState.__savedAddress;
    await updateState(async (draft) => {
      delete draft.__savedAddress;
      return draft;
    });
    ok(res, savedAddress, 201);
    return;
  }

  if (addressMatch && req.method === 'PUT') {
    const nextState = await updateState(async (draft) => {
      draft.__savedAddress = createOrUpdateAddress(draft, getCurrentUserId(req), body, addressMatch[1]);
      return draft;
    });
    const savedAddress = nextState.__savedAddress;
    delete nextState.__savedAddress;
    await updateState(async (draft) => {
      delete draft.__savedAddress;
      return draft;
    });
    ok(res, savedAddress);
    return;
  }

  if (addressMatch && req.method === 'DELETE') {
    await updateState(async (draft) => {
      draft.addresses = draft.addresses.filter((item) => !(item.uid === getCurrentUserId(req) && item.addressId === addressMatch[1]));
      return draft;
    });
    ok(res, { success: true });
    return;
  }

  if (pathname === '/api/orders' && req.method === 'GET') {
    const state = await readState();
    const orderStatus = query.orderStatus !== undefined ? Number(query.orderStatus) : null;
    const pageNum = Number(query.pageNum || 1);
    const pageSize = Number(query.pageSize || 5);
    let orders = state.orders.filter((item) => item.uid === getCurrentUserId(req));
    if (orderStatus !== null && Number.isFinite(orderStatus)) orders = orders.filter((item) => item.orderStatus === orderStatus);
    ok(res, { data: { orders: orders.slice((pageNum - 1) * pageSize, pageNum * pageSize) }, code: 'Success', success: true });
    return;
  }

  if (pathname === '/api/orders/counts' && req.method === 'GET') {
    ok(res, { data: buildOrdersCount(await readState(), getCurrentUserId(req)), code: 'Success', success: true });
    return;
  }

  if (pathname === '/api/orders/business-time' && req.method === 'GET') {
    ok(res, { data: { businessTime: [STORE_SERVICE_TIME], telphone: STORE_SERVICE_PHONE, saasId: '88888888' }, code: 'Success', success: true });
    return;
  }

  if (orderMatch && req.method === 'GET') {
    const state = await readState();
    const order = state.orders.find((item) => item.uid === getCurrentUserId(req) && item.orderNo === orderMatch[1]);
    if (!order) {
      fail(res, 404, '订单不存在');
      return;
    }
    ok(res, { data: order, code: 'Success', success: true });
    return;
  }

  if (pathname === '/api/orders/settle' && req.method === 'POST') {
    ok(res, buildSettleDetail(await readState(), body, getCurrentUserId(req)));
    return;
  }

  if (pathname === '/api/orders/submit' && req.method === 'POST') {
    const nextState = await updateState(async (draft) => {
      draft.__submitResponse = createSubmittedOrder(draft, body, getCurrentUserId(req));
      return draft;
    });
    const response = nextState.__submitResponse;
    await updateState(async (draft) => {
      delete draft.__submitResponse;
      return draft;
    });
    ok(res, response);
    return;
  }

  if (pathname === '/api/admin/goods' && req.method === 'GET') {
    ok(res, { data: (await readState()).goods, code: 'Success', success: true });
    return;
  }

  if (adminGoodsMatch && req.method === 'GET') {
    const state = await readState();
    const target = state.goods.find((item) => item.spuId === adminGoodsMatch[1]);
    if (!target) {
      fail(res, 404, '商品不存在');
      return;
    }
    ok(res, { data: target, code: 'Success', success: true });
    return;
  }

  if (pathname === '/api/admin/goods' && req.method === 'POST') {
    const nextState = await updateState(async (draft) => {
      const nextGood = normalizeAdminGood(body);
      draft.goods.unshift(nextGood);
      return draft;
    });
    ok(res, { data: nextState.goods[0], code: 'Success', success: true }, 201);
    return;
  }

  if (adminGoodsMatch && req.method === 'PATCH') {
    const nextState = await updateState(async (draft) => {
      const target = draft.goods.find((item) => item.spuId === adminGoodsMatch[1]);
      if (!target) throw new Error('商品不存在');
      const nextGood = normalizeAdminGood(body, target);
      const allowedSkuIds = new Set(nextGood.skuList.map((item) => item.skuId));
      draft.goods = draft.goods.map((item) => (item.spuId === adminGoodsMatch[1] ? nextGood : item));
      draft.cartItems = draft.cartItems.filter(
        (item) => item.spuId !== adminGoodsMatch[1] || allowedSkuIds.has(item.skuId),
      );
      return draft;
    }).catch((error) => {
      fail(res, 404, error.message);
      return null;
    });
    if (!nextState) return;
    ok(res, { data: nextState.goods.find((item) => item.spuId === adminGoodsMatch[1]), code: 'Success', success: true });
    return;
  }

  if (adminGoodsMatch && req.method === 'DELETE') {
    const nextState = await updateState(async (draft) => {
      const hasTarget = draft.goods.some((item) => item.spuId === adminGoodsMatch[1]);
      if (!hasTarget) throw new Error('商品不存在');
      draft.goods = draft.goods.filter((item) => item.spuId !== adminGoodsMatch[1]);
      draft.cartItems = draft.cartItems.filter((item) => item.spuId !== adminGoodsMatch[1]);
      return draft;
    }).catch((error) => {
      fail(res, 404, error.message);
      return null;
    });
    if (!nextState) return;
    ok(res, { success: true, code: 'Success' });
    return;
  }

  if (pathname === '/api/admin/goods' && req.method === 'GET') {
    ok(res, { data: (await readState()).goods, code: 'Success', success: true });
    return;
  }

  if (pathname === '/api/admin/goods' && req.method === 'POST') {
    const nextState = await updateState(async (draft) => {
      draft.goods.push({ ...body, spuId: body.spuId || `${Date.now()}`, saasId: '88888888', storeId: '1000' });
      return draft;
    });
    ok(res, { data: nextState.goods[nextState.goods.length - 1], code: 'Success', success: true }, 201);
    return;
  }

  if (adminGoodsMatch && req.method === 'PATCH') {
    const nextState = await updateState(async (draft) => {
      const target = draft.goods.find((item) => item.spuId === adminGoodsMatch[1]);
      if (!target) throw new Error('商品不存在');
      if (body.title !== undefined) target.title = body.title;
      if (body.minSalePrice !== undefined) target.minSalePrice = `${body.minSalePrice}`;
      if (body.maxSalePrice !== undefined) target.maxSalePrice = `${body.maxSalePrice}`;
      if (body.minLinePrice !== undefined) target.minLinePrice = `${body.minLinePrice}`;
      if (body.maxLinePrice !== undefined) target.maxLinePrice = `${body.maxLinePrice}`;
      if (Array.isArray(body.skuList)) {
        target.skuList = body.skuList;
      }
      return draft;
    }).catch((error) => {
      fail(res, 404, error.message);
      return null;
    });
    if (!nextState) return;
    ok(res, { data: nextState.goods.find((item) => item.spuId === adminGoodsMatch[1]), code: 'Success', success: true });
    return;
  }

  fail(res, 404, `未找到接口：${req.method} ${pathname}`);
}

async function main() {
  await ensureDataFile({ reset: process.argv.includes('--reset') });
  const server = http.createServer((req, res) => {
    handler(req, res).catch((error) => {
      console.error('[fresh-garden-api] request error:', error);
      fail(res, 500, error.message || '服务器异常');
    });
  });
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[fresh-garden-api] running at http://127.0.0.1:${PORT}/api/health`);
  });
}

main().catch((error) => {
  console.error('[fresh-garden-api] boot error:', error);
  process.exit(1);
});
