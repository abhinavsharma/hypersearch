import { debug, INTERCEPTIBLE_SEARCH_HOST_PARAMS, STYLE_COLOR_LUMOS_GOLD, STYLE_PADDING_PILL, STYLE_BORDER_RADIUS_PILL } from "../shared/constants";
import { isGoogleSerp, getGoogleBlueLinks, insertPill } from "./google";
import { postMessageToReactApp, addReactAppListener } from "./messenger";

function createSerpPill(networkIcon: URL, networkName: string, reactionEmoji: string, reactionText: string, reactionExtra: string) {
    let pill = document.createElement("div");
    pill.setAttribute("style", `
        background: ${STYLE_COLOR_LUMOS_GOLD};
        border-radius: ${STYLE_BORDER_RADIUS_PILL};
        padding: ${STYLE_PADDING_PILL};
        display: inline-block;
    `)
    let networkIconImg = document.createElement("img")
    networkIconImg.src = networkIcon.href
    networkIconImg.setAttribute("style", `
        width: 15px;
        height: 15px;
        position: relative;
        top: 2px;
        left: -1px;
    `)

    pill.appendChild(networkIconImg)
    pill.appendChild(document.createTextNode(networkName))
    pill.appendChild(document.createTextNode(" • "))
    pill.appendChild(document.createTextNode(reactionEmoji))
    pill.appendChild(document.createTextNode(reactionText))
    pill.appendChild(document.createTextNode(" • "))
    pill.appendChild(document.createTextNode(reactionExtra))

    return pill
}

export function extractSearchText(url: URL) {
    debug("function call - isInterceptibleSearchPage", url);
    const paramToExtract = INTERCEPTIBLE_SEARCH_HOST_PARAMS[url.hostname]
    if (paramToExtract) {
        return url.searchParams.get(paramToExtract)
    }
    return null
}

function getSearchResultLinks(document: Document) {
    debug("function call - getSearchResultLinks", document)
    const url = new URL(document.location.href)

    if (isGoogleSerp(url)) {
        return getGoogleBlueLinks(document)
    } else {
        // TODO: logic for other search engines
        return []
    }
}

export function modifyPageSerp(document: Document) {
    const serpHrefs = getSearchResultLinks(document)

    // wait for isMessengerReady
    // get link info
    // create pills
    // insert pills
    serpHrefs.forEach(function(serpHref) {
        postMessageToReactApp("getLinkInfo", {link: serpHref})
        addReactAppListener("newLinkData", function(msg) {
            debugger;
            return null
        })

        postMessageToReactApp("getPublicationInfo", {link: serpHref})
        addReactAppListener("newPublicationData", function(msg) {
            debugger;
            return null
        })

        // create pill
        let pill = createSerpPill(
            new URL("https://identity.stanford.edu/img/seal-dark-red.png"),
            "Stanford",
            "😷",
            "Good for patients",
            "by Uptodate"
        )
        insertPill(new URL(serpHref), pill)
        insertPill(new URL(serpHref), pill)
    })
    // TODO send up to api
    // TODO generate pills locally
    // attach pill to link
}