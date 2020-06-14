import Language from '../../utils/Language';

import ResourceData from '../../data/resources.json';

class Resources {

    getBenefitResources(eligibility, benefit) {
        const lang = Language.language_code;
        let resources = [];
        if (benefit in ResourceData.benefits) {
            for (let r of ResourceData.benefits[benefit]) {
                if (lang in r.link) {
                    resources.push({
                        text: r.text,
                        link: r.link[lang]
                    });
                }
            }
        }
        return resources;
    }

    getOtherResources() {
        let resources = [];
        const lang = Language.language_code;
        for (let r of ResourceData.other) {
            if (lang in r.link) {
                resources.push({
                    text: r.text,
                    link: r.link[lang]
                });
            }
        }
        return resources;
    }

}

export default new Resources();
