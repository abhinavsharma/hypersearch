export const LUMOS_API_URL = "https://zy6kcqa01a.execute-api.us-east-2.amazonaws.com/prod/";
export const LUMOS_APP_URL = "https://app.lumosbrowser.com/messenger/";
export const LUMOS_LOGO_SVG_URL = chrome.extension.getURL('logo128.png');
export const QUERY_PARAM_STRING = "q";

export const MESSAGES = {
    'BROWSERBG_BROWSERFG_URL_UPDATED': 'BROWSERBG_BROWSERFG_URL_UPDATED',
}

export const CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR = 'lumos_sidebar'
export const CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_OVERLAY = 'lumos_sidebar_overlay'
export const CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_TABS = 'lumos_sidebar_tabs'
export const CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_CONTENT = 'lumos_sidebar_content'


export const CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_SHOW = 'lumos_sidebar_show'
export const CONTENT_PAGE_ELEMENT_ID_LUMOS_SIDEBAR_HIDE = 'lumos_sidebar_hide'
export const CONTENT_PAGE_ELEMENT_ID_LUMOS_DRAWER = 'lumos_drawer'
export const CONTENT_PAGE_ELEMENT_ID_LUMOS_HIDDEN = 'lumos_hidden'

export function debug(...args: any[]) {
    console.log("LUMOS DEBUG: ", ...args);
}

export const STYLE_COLOR_BORDER = '#efefef';
export const STYLE_COLOR_LINK = '#609';
export const STYLE_COLOR_TEXT = '#333';
export const STYLE_COLOR_LUMOS_GOLD = 'rgb(249, 236, 105, 0.3)'
export const STYLE_COLOR_LUMOS_GOLD_SOLID = 'rgb(249, 236, 105, 1)'

export const STYLE_PADDING_PILL = '2px 5px';
export const STYLE_PADDING_SMALL = '5px';
export const STYLE_PADDING_MEDIUM = '10px';
export const STYLE_PADDING_LARGE = '15px';

export const STYLE_BORDER_RADIUS_PILL = '10px'

export const STYLE_WIDTH_SIDEBAR = '300px'
export const STYLE_WIDTH_SIDEBAR_TAB = '100px'
export const STYLE_WIDTH_SIDEBAR_TAB_LEFT = '30px'
export const STYLE_WIDTH_SIDEBAR_TAB_RIGHT = '65px'

export const STYLE_SIDEBAR_HIDER_X_OFFSET = '-20px'
export const STYLE_SIDEBAR_HIDER_Y_OFFSET = '20px'

export const STYLE_SIDEBAR_SHOWER_X_OFFSET = '30px'
export const STYLE_SIDEBAR_SHOWER_Y_OFFSET = '30px'

export const STYLE_SIDEBAR_TOGGLER_WIDTH = '100px'

export const STYLE_HEIGHT_DRAWER = '50px'

export const STYLE_FONT_SIZE_SMALL = '10px'
export const STYLE_FONT_SIZE_MEDIUM = '14px'
export const STYLE_FONT_SIZE_LARGE = '18px'

export const STYLE_ZINDEX_MAX = '2147483648'

export const INTERCEPTIBLE_SEARCH_HOST_PARAMS = {
    'www.google.com': 'q',
    'google.com': 'q',
    'www.bing.com': 'q'
}