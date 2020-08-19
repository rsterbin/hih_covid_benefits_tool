import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

import VisitorCookie from '../storage/cookies/VisitorCookie';

const VERSION_RELEASED = DateTime.fromISO('2020-08-19 00:00:00', { zone: 'America/New_York' });
const COOKIE_BLANK = { id: null, save_date: null, prefs: null };

const ACCEPT_ALL = { allow_cookies_thirdparty: true };
const REJECT_ALL = { allow_cookies_thirdparty: false };

class VisitorPrefs {

    options = [
        {
            key: 'allow_cookies_self',
            title_lang_key: 'cookie_notice_option_self_title',
            desc_lang_key: 'cookie_notice_option_self_description',
            input: 'always'
        },
        {
            key: 'allow_cookies_thirdparty',
            title_lang_key: 'cookie_notice_option_thirdparty_title',
            desc_lang_key: 'cookie_notice_option_thirdparty_desc',
            input: 'toggle'
        }
    ];

    fetchFromCookie() {
        let found = {
            id: null,
            prefs: null,
            error: null
        };

        let visitor_data = VisitorCookie.get();
        if (!visitor_data) {
            visitor_data = COOKIE_BLANK;
        }
        if (!visitor_data.id) {
            let new_id = uuidv4();
            if (new_id) {
                visitor_data.id = new_id;
            } else {
                found.error = 'Could not create a visitor ID';
                return found;
            }
        }
        VisitorCookie.set(visitor_data);
        found.id = visitor_data.id;
        found.prefs = 'prefs' in visitor_data ? visitor_data.prefs : null;

        // Check save date. If we've updated our visitor preference settings
        // since then, they'll need to reverify.
        const save_date = visitor_data.save_date ? DateTime.fromISO(visitor_data.save_date) : null;
        if (save_date !== null) {
            if (save_date < VERSION_RELEASED) {
                found.prefs = null;
                return found;
            }
        }

        // If we have prefs, load and verify them
        if (found.prefs !== null) {
            let clean = REJECT_ALL;
            if (found.prefs !== null && typeof found.prefs === 'object') {
                for (var k in REJECT_ALL) {
                    if (found.prefs[k]) {
                        clean[k] = true;
                    }
                }
            }
            found.prefs = clean;
        }

        return found;
    }

    save(prefs) {

        // Fetch cookie
        let visitor_data = VisitorCookie.get() || COOKIE_BLANK;

        // Clean prefs
        let clean = REJECT_ALL;
        for (var k in REJECT_ALL) {
            if (prefs[k]) {
                clean[k] = true;
            }
        }
        visitor_data.prefs = clean;

        // Mark save date
        visitor_data.save_date = DateTime.local();;

        // Store it
        VisitorCookie.set(visitor_data);

        return clean;
    }

}

export { ACCEPT_ALL, REJECT_ALL };
export default new VisitorPrefs();
