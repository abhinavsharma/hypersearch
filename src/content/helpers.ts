import { LUMOS_API_URL, IDrawerResponse } from 'lumos-shared-js'

// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
export const isMobileDevice = window.navigator.userAgent.toLowerCase().includes("mobi");

export async function getAPI(api: string, params = {}): Promise<any> {
    let url: URL = new URL(LUMOS_API_URL + api);
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


export async function postAPI(api: string, params = {}, body = {}): Promise<any> {
  let url: URL = new URL(LUMOS_API_URL + api);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  
  const response = await fetch(url.href, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    body: JSON.stringify(body) // TODO: may move to this later
  });

  const response_json = await response.json();

  if (response_json) {
    return response_json
  }
}
