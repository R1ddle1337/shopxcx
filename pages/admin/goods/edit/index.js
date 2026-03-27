import Toast from 'tdesign-miniprogram/toast/index';
import { getCategoryList } from '../../../../services/good/fetchCategoryList';
import {
  createAdminGood,
  fetchAdminGood,
  updateAdminGood,
} from '../../../../services/admin/goods';
import {
  buildGoodPayload,
  createDefaultForm,
  createSkuItem,
  formatGoodForForm,
  getCategoryIndex,
  getCategoryOptions,
  getDefaultImageByCategory,
} from '../utils';

Page({
  data: {
    loading: true,
    saving: false,
    isEdit: false,
    spuId: '',
    categoryOptions: getCategoryOptions(),
    categoryIndex: 0,
    categoryLabel: '鲜果',
    form: createDefaultForm(),
  },

  onLoad(options) {
    const spuId = options?.spuId || '';
    this.setData(
      {
        spuId,
        isEdit: Boolean(spuId),
      },
      () => {
        this.loadPage();
      },
    );
  },

  async loadPage() {
    this.setData({ loading: true });

    try {
      const categoryOptions = getCategoryOptions(await getCategoryList().catch(() => []));

      if (this.data.spuId) {
        const good = await fetchAdminGood(this.data.spuId);
        const form = formatGoodForForm(good);
        const categoryIndex = getCategoryIndex(categoryOptions, form.categoryId);

        this.setData({
          form,
          categoryOptions,
          categoryIndex,
          categoryLabel: categoryOptions[categoryIndex]?.label || '',
        });
      } else {
        const form = createDefaultForm();
        form.categoryId = categoryOptions[0]?.value || form.categoryId;
        form.primaryImage = getDefaultImageByCategory(form.categoryId);
        form.carouselImagesText = form.primaryImage;

        this.setData({
          form,
          categoryOptions,
          categoryIndex: getCategoryIndex(categoryOptions, form.categoryId),
          categoryLabel: categoryOptions[0]?.label || '',
        });
      }
    } catch (error) {
      this.showMessage('商品数据加载失败，请确认本地 API 已启动');
    } finally {
      this.setData({ loading: false });
    }
  },

  showMessage(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
  },

  onFieldChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value,
    });
  },

  onCategoryChange(e) {
    const categoryIndex = Number(e.detail.value || 0);
    const option = this.data.categoryOptions[categoryIndex] || this.data.categoryOptions[0];
    const currentCategoryId = this.data.form.categoryId;
    const currentPrimaryImage = this.data.form.primaryImage;
    const currentDefaultImage = getDefaultImageByCategory(currentCategoryId);
    const nextDefaultImage = getDefaultImageByCategory(option.value);
    const shouldSyncPrimaryImage = !currentPrimaryImage || currentPrimaryImage === currentDefaultImage;
    const nextPrimaryImage = shouldSyncPrimaryImage ? nextDefaultImage : currentPrimaryImage;
    const currentImagesText = `${this.data.form.carouselImagesText || ''}`.trim();

    this.setData({
      categoryIndex,
      categoryLabel: option.label,
      'form.categoryId': option.value,
      'form.primaryImage': nextPrimaryImage,
      'form.carouselImagesText':
        !currentImagesText || currentImagesText === currentDefaultImage ? nextPrimaryImage : this.data.form.carouselImagesText,
    });
  },

  onShelfChange(e) {
    this.setData({
      'form.isPutOnSale': e.detail.value,
    });
  },

  onSkuFieldChange(e) {
    const { index, field } = e.currentTarget.dataset;
    this.setData({
      [`form.skuItems[${index}].${field}`]: e.detail.value,
    });
  },

  addSku() {
    const nextSkuList = [
      ...this.data.form.skuItems,
      createSkuItem({
        specValue: `规格${this.data.form.skuItems.length + 1}`,
        salePrice: '0.00',
        linePrice: '0.00',
        stockQuantity: '0',
        weight: '1',
        skuImage: this.data.form.primaryImage,
      }),
    ];

    this.setData({
      'form.skuItems': nextSkuList,
    });
  },

  removeSku(e) {
    const { index } = e.currentTarget.dataset;
    const nextSkuList = [...this.data.form.skuItems];

    if (nextSkuList.length <= 1) {
      this.showMessage('至少保留一个规格');
      return;
    }

    nextSkuList.splice(index, 1);
    this.setData({
      'form.skuItems': nextSkuList,
    });
  },

  validateForm() {
    const { form } = this.data;

    if (!`${form.title || ''}`.trim()) return '请输入商品名称';
    if (!`${form.primaryImage || ''}`.trim()) return '请输入商品主图';
    if (!form.skuItems.length) return '至少保留一个规格';

    for (let index = 0; index < form.skuItems.length; index += 1) {
      const item = form.skuItems[index];
      const salePrice = Number(item.salePrice);
      const linePrice = Number(item.linePrice);
      const stockQuantity = Number(item.stockQuantity);
      const weight = Number(item.weight);

      if (!`${item.specValue || ''}`.trim()) return `请填写规格 ${index + 1} 名称`;
      if (!Number.isFinite(salePrice) || salePrice < 0) return `规格 ${index + 1} 售价格式不正确`;
      if (!Number.isFinite(linePrice) || linePrice < salePrice) return `规格 ${index + 1} 划线价不能低于售价`;
      if (!Number.isInteger(stockQuantity) || stockQuantity < 0) return `规格 ${index + 1} 库存必须是非负整数`;
      if (!Number.isFinite(weight) || weight <= 0) return `规格 ${index + 1} 重量必须大于 0`;
    }

    return '';
  },

  async handleSubmit() {
    if (this.data.saving) return;

    const errorMessage = this.validateForm();
    if (errorMessage) {
      this.showMessage(errorMessage);
      return;
    }

    this.setData({ saving: true });

    try {
      const payload = buildGoodPayload(this.data.form);
      if (this.data.isEdit) {
        await updateAdminGood(this.data.spuId, payload);
      } else {
        await createAdminGood(payload);
      }

      this.showMessage(this.data.isEdit ? '商品已更新' : '商品已创建');
      setTimeout(() => {
        wx.navigateBack({ delta: 1 });
      }, 300);
    } catch (error) {
      this.showMessage('保存失败，请稍后重试');
    } finally {
      this.setData({ saving: false });
    }
  },
});
