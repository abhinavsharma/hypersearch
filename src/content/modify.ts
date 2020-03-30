import { debug, serpUrlToSearchText, serpDocumentToLinks, createSerpPill, insertPillIntoSerp } from "lumos-shared-js";
import { postMessageToReactApp, addReactAppListener } from "./messenger";

export function modifyPageSerp(window: Window, document: Document) {
    const serpHrefs = serpDocumentToLinks(document)
    serpHrefs.forEach(function(serpHref) {
        postMessageToReactApp("getPublicationInformation", {link: serpHref})
    })
    addReactAppListener(window, "newPublicationInformation", function(msg) {
        msg.data.publicationData.forEach((publicationDatum : any) => {
            let pill = createSerpPill(
                new URL(publicationDatum.networkIcon),
                publicationDatum.networkName,
                publicationDatum.reactionIcon,
                publicationDatum.reaction,
                publicationDatum.opinionator,
            )
            insertPillIntoSerp(document, new URL(msg.data.link), pill)
        });
        return null
    })
}

export function modifyPage(url: URL, window: Window, document: Document) {
    debug("function call - modifyPage", url)
    // features to support
    // search link annotation (TODO)
    // readability (TODO)
    // highlighting (TODO)
    // article link annotation (TODO)


    // search link annotation
    const searchText = serpUrlToSearchText(url);
    if (searchText) {
        modifyPageSerp(window, document)
    }
}
