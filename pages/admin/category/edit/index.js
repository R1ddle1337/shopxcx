import Toast from 'tdesign-miniprogram/toast/index';
import {
  createAdminCategory,
  fetchAdminCategory,
  updateAdminCategory,
} from '../../../../services/admin/categories';
import {
  buildCategoryPayload,
  createDefaultForm,
  formatCategoryForForm,
} from '../utils';

Page({
  data: {
    loading: true,
    saving: false,
    isEdit: false,
    groupId: '',
    form: createDefaultForm(),
  },

  onLoad(options) {
    const groupId = options?.groupId || '';
    this.setData(
      {
        groupId,
        isEdit: Boolean(groupId),
      },
      () => {
        this.loadCategory();
      },
    );
  },

  showMessage(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
  },

  async loadCategory() {
    if (!this.data.groupId) {
      this.setData({ loading: false });
      return;
    }

    try {
      const category = await fetchAdminCategory(this.data.groupId);
      this.setData({
        form: formatCategoryForForm(category),
      });
    } catch (error) {
      this.showMessage('分类加载失败，请稍后重试');
    } finally {
      this.setData({ loading: false });
    }
  },

  onFieldChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value,
    });
  },

  validateForm() {
    const { form, isEdit } = this.data;
    if (!`${form.name || ''}`.trim()) return '请输入分类名称';
    if (!isEdit && !`${form.groupId || ''}`.trim()) return '请输入分类 ID';
    if (!`${form.thumbnail || ''}`.trim()) return '请输入分类图片';
    if (!`${form.sectionName || ''}`.trim()) return '请输入专题名称';
    if (!`${form.sampleItemName || ''}`.trim()) return '请输入示例名称';
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
      const payload = buildCategoryPayload(this.data.form);
      if (this.data.isEdit) {
        await updateAdminCategory(this.data.groupId, payload);
      } else {
        await createAdminCategory(payload);
      }
      this.showMessage(this.data.isEdit ? '分类已更新' : '分类已创建');
      setTimeout(() => {
        wx.navigateBack({ delta: 1 });
      }, 300);
    } catch (error) {
      this.showMessage(error?.msg || error?.message || '保存失败，请稍后重试');
    } finally {
      this.setData({ saving: false });
    }
  },
});
