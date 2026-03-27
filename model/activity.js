export function getActivity(key) {
  return {
    promotionId: `${key}`,
    title: `鲜蔬限时活动 ${key}`,
    description: null,
    promotionCode: 'MERCHANT',
    promotionSubCode: key % 2 === 0 ? 'MYJ' : 'MYG',
    tag: key % 2 === 0 ? '满减' : '满折',
    timeType: 1,
    startTime: '1711468800000',
    endTime: '1893456000000',
    teasingStartTime: null,
    activityLadder: [{ label: key % 2 === 0 ? '满 59 元减 10 元' : '第 2 件 9 折' }],
  };
}
