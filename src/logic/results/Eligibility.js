
import EligibilityData from '../../data/eligibility.json';

class Eligibility {

    screen(scenarios) {
        let eligibility = {};
        for (let benefit in scenarios) {
            let found = null;
            const bdata = benefit in EligibilityData ? EligibilityData[benefit] : [];
            for (let r of bdata) {
                let match = true;
                for (const c of Object.keys(r.conditions)) {
                    if (scenarios[benefit][c] !== r.conditions[c]) {
                        match = false;
                    }
                }
                if (match) {
                    found = r.lang_lookup_key;
                    break;
                }
            }
            if (found !== null) {
                eligibility[benefit] = found;
            }
        }
        return eligibility;
    }

}

export default new Eligibility();
