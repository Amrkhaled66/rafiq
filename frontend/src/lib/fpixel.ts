export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq && FB_PIXEL_ID) {
    window.fbq("track", "PageView");
  }
};

export const event = (name: string, options = {}) => {
  if (typeof window !== "undefined" && window.fbq && FB_PIXEL_ID) {
    window.fbq("track", name, options);
  }
};

export const customEvent = (name: string, options = {}) => {
  if (typeof window !== "undefined" && window.fbq && FB_PIXEL_ID) {
    window.fbq("trackCustom", name, options);
  }
};