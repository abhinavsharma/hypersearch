import { LUMOS_API_URL, MESSAGES } from '../shared/constants'

export const isMobileDevice = window.navigator.userAgent.toLowerCase().includes("mobi");

export async function getAPI(api, params = {}) {
    let url = new URL(LUMOS_API_URL + api);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    
    const response = await fetch(url.href, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // body: JSON.stringify(params) // TODO: may move to this later
    });

    const response_json = await response.json();

    if (response_json) {
      return response_json
    }
  }
