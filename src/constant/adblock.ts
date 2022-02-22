/**
 * @module constants:adblock
 * @version 1.0.0
 * @license (C) Insight
 */

export const BLOCKED_ADS = [
  {
    site: 'twitter.com',
    adText: 'Promoted',
    adElementSelector: 'article',
  },
  {
    site: 'duckduckgo.com',
    adText: 'Ad',
    adElementSelector: '#ads',
    delay: 1000,
  },
  {
    site: 'bing.com',
    adText: 'Ad',
    adElementSelector: '.b_ad',
  },
  {
    site: 'facebook.com',
    adText: 'Sponsored',
    adElementSelector: 'article',
  },
  {
    site: 'reddit.com',
    adText: 'Promoted, Sponsored',
    adElementSelector: 'article',
  },
  {
    site: 'm.facebook.com',
    adText: 'Sponsored',
    adElementSelector: 'article',
  },
  {
    site: 'instagram.com',
    adText: 'Sponsored',
    adElementSelector: 'article',
  },
  {
    site: 'mobile.twitter.com',
    adText: 'Promoted',
    adElementSelector: 'article',
  },
  {
    site: 'amazon.com',
    adText: 'Sponsored',
    adElementSelector: 'div.s-result-item',
  },
  {
    site: 'm.youtube.com',
    adTextContainer: 'ytm-badge',
    adText: 'AD',
    adElementSelector: 'ytm-item-section-renderer',
  },
  {
    site: 'm.youtube.com',
    adTextContainer: 'ytm-badge',
    adText: 'AD',
    adElementSelector: 'ytm-rich-item-renderer',
  },
  {
    site: 'google.com',
    adText: 'Ad,Ad·',
    adElementSelector: '#tads',
  },
  {
    site: 'google.com',
    adText: 'Ad,Ad·',
    adElementSelector: '#tadsb',
  },
  {
    site: 'google.com',
    adText: 'Ads,Ads·',
    adElementSelector: '.cu-container',
  },
  {
    site: 'google.com',
    adText: 'Ads',
    adElementSelector: '.mnr-c',
  },
  {
    site: 'google.com',
    adText: 'Ads',
    adElementSelector: '._-is',
  },
  {
    site: 'google.com',
    adText: 'Ads',
    adElementSelector: '.commercial-unit-mobile-top',
  },
  {
    site: 'ecosia.org',
    adText: 'Ad',
    adTextContainer: 'a',
    adElementSelector: '.result-body',
  },
  {
    site: 'ecosia.org',
    adText: 'Ads',
    adTextContainer: 'a',
    adElementSelector: '.product-ad',
  },
] as const;
