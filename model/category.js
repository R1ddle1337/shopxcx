export function getCategoryList() {
  return [
    {
      groupId: 'fruit',
      name: '鲜果',
      thumbnail: '/assets/produce/apple.svg',
      children: [
        {
          groupId: 'fruit-hot',
          name: '热卖鲜果',
          thumbnail: '/assets/produce/citrus.svg',
          children: [
            {
              groupId: 'fruit-hot-1',
              name: '苹果礼盒',
              thumbnail: '/assets/produce/apple.svg',
            },
            {
              groupId: 'fruit-hot-2',
              name: '沃柑鲜果箱',
              thumbnail: '/assets/produce/citrus.svg',
            },
          ],
        },
      ],
    },
    {
      groupId: 'vegetable',
      name: '时蔬',
      thumbnail: '/assets/produce/broccoli.svg',
      children: [
        {
          groupId: 'vegetable-fresh',
          name: '今日鲜蔬',
          thumbnail: '/assets/produce/tomato.svg',
          children: [
            {
              groupId: 'vegetable-fresh-1',
              name: '有机西兰花',
              thumbnail: '/assets/produce/broccoli.svg',
            },
            {
              groupId: 'vegetable-fresh-2',
              name: '沙瓤番茄',
              thumbnail: '/assets/produce/tomato.svg',
            },
          ],
        },
      ],
    },
  ];
}
