const isMobileDevice = window.navigator.userAgent.toLowerCase().includes("mobi");

function getSearchContainers() {
    if (isMobileDevice) {
        return document.querySelectorAll('.KJDcUb')
    } else {
        return document.querySelectorAll('.srg .g .rc')
    }
}

export function getGoogleBlueLinks(document: Document) {
    let result = []
    let searchContainers = getSearchContainers()
    searchContainers.forEach(function (blueLinkContainer: HTMLElement) {
        result.push(blueLinkContainer.querySelector('a').href)
    })
    return result
}


export function insertPill(url: URL, pill: HTMLElement) {
    let searchContainers = getSearchContainers()
    searchContainers.forEach(function (blueLinkContainer: HTMLElement) {
        let linkElem = blueLinkContainer.querySelector('a')
        if (linkElem.href === url.href) {
            blueLinkContainer.parentNode.insertBefore(pill, blueLinkContainer)

            if (isMobileDevice) {
                pill.style.marginLeft = '10px'
                pill.style.marginTop = '5px'
            } else {
                pill.style.marginRight = '5px'
            }
            pill.style.marginBottom = '5px'
        }
    })
}

export function isGoogleSerp(url: URL) {
    return (url.hostname === "www.google.com" && 
        url.pathname === '/search' &&
        url.searchParams.get('q'))
}