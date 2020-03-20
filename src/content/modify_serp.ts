import { debug, INTERCEPTIBLE_SEARCH_HOST_PARAMS, STYLE_COLOR_LUMOS_GOLD } from "../shared/constants";
import { isGoogleSerp, getGoogleBlueLinks } from "./google";

function createSerpPill(networkIcon: URL, networkName: string, reactionEmoji: string, reactionText: string) {
    let pill = document.createElement("span");
    pill.setAttribute("style", `
        background: ${STYLE_COLOR_LUMOS_GOLD};
        border-radius: 50%;
    `)
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
    const serpLinks = getSearchResultLinks(document)
    // TODO send up to api
    // TODO generate pills locally
    // attach pill to link
}