/**
 * Google AdSense 配置
 * 将下面的 PUB-ID 替换为你自己的 AdSense 发布商 ID
 * 例如: "pub-1234567890123456"
 */
export const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "";

// 广告单元 ID（可选，用于响应式广告）
export const ADSENSE_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT || "";

// 是否在开发环境显示广告（生产环境始终显示）
export const SHOW_ADS_IN_DEV = process.env.NEXT_PUBLIC_SHOW_ADS_IN_DEV === "true";

// 判断是否启用广告
export const isAdSenseEnabled = () => {
  return ADSENSE_PUB_ID.length > 0 && !ADSENSE_PUB_ID.includes("placeholder");
};