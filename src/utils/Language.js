import Logger from './Logger';
import LanguageCookie from '../storage/cookies/LanguageCookie';

import Keys from '../data/lang/keys.json';

class Language {

    language_code = null;
    loaded = false;
    translations = null;
    allowed_languages = [ 'en' ];

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

    init() {
        let cookie_lang = LanguageCookie.get();
        if (cookie_lang && this.allowed_languages.includes(cookie_lang)) {
            this.load(cookie_lang);
        } else {
            this.load('en');
        }
    }

    get(key, transform) {
        if (!this.loaded) {
            this.init();
            if (!this.loaded) {
                Logger.alert('Translation was requested, but the current language could not be loaded ', { key: key });
                return key;
            }
        }
        if (key in this.translations) {
            let translation = this.translations[key];
            if (typeof transform === 'function') {
                translation = transform(translation);
            }
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

export { Language };
export default new Language('en');
