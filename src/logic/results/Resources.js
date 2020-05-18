import Language from '../../utils/Language';

import ResourceData from '../../data/resources.json';

class Resources {

    getBenefitResources(eligibility) {
        let resources = {};
        const lang = Language.language_code;
        for (let benefit in eligibility) {
            if (benefit in ResourceData.benefits) {
                let b_resources = [];
                for (let r of ResourceData.benefits[benefit]) {
                    if (lang in r.link) {
                        b_resources.push({
                            text: r.text,
                            link: r.link[lang]
                        });
                    }
                }
                resources[benefit] = b_resources;
            }
        }
        return resources;
    }

    getOtherResources() {
        let o_resources = [];
        const lang = Language.language_code;
        for (let r of ResourceData.other) {
            if (lang in r.link) {
                o_resources.push({
                    text: r.text,
                    link: r.link[lang]
                });
            }
        }
        return o_resources;
    }

}

export default new Resources();
