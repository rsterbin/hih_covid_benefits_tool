
const ALL_PIXELS = [
    { method: "facebook", pref_setting: "allow_cookies_thirdparty" }
];

class Pixels {

    invoke(prefs) {
        for (const pixel of ALL_PIXELS) {
            if (prefs && prefs[pixel.pref_setting]) {
                this[pixel.method]();
            }
        }
    }

    facebook() {
        window.fbq('consent', 'grant');
        window.fbq('track', 'ViewContent');
    }

}

export default new Pixels();
