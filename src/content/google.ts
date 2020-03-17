const isMobileDevice = window.navigator.userAgent.toLowerCase().includes("mobi");
export function getGoogleBlueLinks(document: Document) {
    let result = []
    let searchContainers;
    if (isMobileDevice) {
        searchContainers = document.querySelectorAll('.KJDcUb')
    } else {
        searchContainers = document.querySelectorAll('.srg .g .rc')
    }
    searchContainers.forEach(function (blueLinkContainer: HTMLElement) {
        result.push(blueLinkContainer.querySelector('a').href)
    })
    return result
}

export function isGoogleSerp(url: URL) {
    return (url.hostname === "www.google.com" && 
        url.pathname === '/search' &&
        url.searchParams.get('q'))
}