/**
 * @module lib:darkmode
 * @license (C) Insight
 * @version 1.0.0
 */

const Darkmode = require('./darkmode');

class DarkMode {

  public enable = async (document: Document) => {
    const darkmode = Darkmode(document);
    darkmode.auto(undefined, undefined, true);
  };

}

/**
 * Static instance of the darkmode.
 */
 const instance = new DarkMode();

 export default instance;
