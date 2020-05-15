import Logger from './Logger';

import Keys from '../data/lang/keys.json';

class Language {

    language_code = null;
    loaded = false;
    translations = null;

    constructor(code) {
        if (code) {
            this.load(code);
        }
    }

    load(code) {
        let r = null;
        try {
            r = require('../data/lang/' + code + '.json');
        } catch {
            r = null;
        }
        if (r === null) {
            this.reportError();
            return false;
        }
        this.translations = r;
        this.language_code = code;
        this.loaded = true;
    }

    get(key) {
        if (!this.loaded) {
            Logger.alert('Translation requested before the language was loaded', { key: key });
            return key;
        }
        if (key in this.translations) {
            let translation = this.translations[key];
            if (key in Keys) {
                if (Keys[key].markdown_allowed) {
                    translation = this.markdown(translation);
                    if (!translation.match(/^</)) {
                        translation = '<p>' + translation + '</p>';
                    }
                }
            }
            return translation;
        } else {
            if (key in Keys) {
                Logger.alert('Missing translation', { lang: this.language_code, key: key, doc: Keys[key] });
            } else {
                Logger.alert('Translation requested for undocumented key', { key: key });
            }
        }
        return key;
    }

    markdown(translation) {
        if (!this.md) {
            this.md = require('markdown-it')();
        }
        return this.md.render(translation);
    }

}

export default new Language('en');
