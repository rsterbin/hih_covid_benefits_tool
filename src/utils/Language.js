import Logger from './Logger';
import LanguageCookie from '../storage/cookies/LanguageCookie';

import Keys from '../data/lang_keys.json';

const TOKEN_OPTIONS = {
    employee_type: [ 'nanny', 'house cleaner', 'home attendant', 'home health care worker' ],
};

const TOKEN_REGEX_TAG_OPEN = '\\{\\{';
const TOKEN_REGEX_TAG_CLOSE = '\\}\\}';

class Language {

    language_code = null;
    loaded = false;
    translations = null;
    allowed_languages = [ 'en' ];

    load(code) {
        let r = null;
        try {
            r = require('../data/lang_' + code + '.json');
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

    get(key, tokens) {
        let translation = this.get_raw(key);
        if (translation === null) {
            return key;
        }
        if (tokens) {
            translation = this.replace_tokens(translation, tokens);
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
    }

    get_raw(key) {
        if (!this.loaded) {
            this.init();
            if (!this.loaded) {
                Logger.alert('Translation was requested, but the current language could not be loaded ', { key: key });
                return null;
            }
        }
        if (key in this.translations) {
            return this.translations[key];
        } else {
            if (key in Keys) {
                Logger.alert('Missing translation', { lang: this.language_code, key: key, doc: Keys[key] });
            } else {
                Logger.alert('Translation requested for undocumented key', { key: key });
            }
        }
        return null;
    }

    markdown(translation) {
        if (!this.md) {
            this.md = require('markdown-it')();
        }
        return this.md.render(translation);
    }

    replace_tokens(translation, tokens) {
        for (const token in tokens) {
            if (this.get_token_options(token).includes(tokens[token])) {
                const regexp = new RegExp(TOKEN_REGEX_TAG_OPEN +
                    token + TOKEN_REGEX_TAG_CLOSE, 'g');
                translation = translation.replace(regexp, tokens[token]);
            }
        }
        return translation;
    }

    get_token_options(token) {
        if (token in TOKEN_OPTIONS) {
            return TOKEN_OPTIONS[token];
        }
        return [];
    }

}

export { Language, TOKEN_REGEX_TAG_OPEN, TOKEN_REGEX_TAG_CLOSE };
export default new Language('en');
