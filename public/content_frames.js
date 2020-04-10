// makes all iframe links open outside the iframe, used for the sidebar
if (window.location !== window.parent.location) {
    document.querySelectorAll('a').forEach((linkElement) => {
        linkElement.setAttribute("target", "_blank")
    })
}