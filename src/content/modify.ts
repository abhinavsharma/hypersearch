import { debug } from "../shared/constants";
import { modifyPageSerp, extractSearchText } from "./modify_serp";


export function modifyPage(url: URL) {
    debug("function call - modifyPage", url)
    // features to support
    // search link annotation (TODO)
    // readability (TODO)
    // highlighting (TODO)
    // article link annotation (TODO)


    // search link annotation
    const searchText = extractSearchText(url);
    if (searchText) {
        modifyPageSerp(window, document)
    }
}
