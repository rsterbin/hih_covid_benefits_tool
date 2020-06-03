
import ScenariosData from '../../data/scenarios.json';

class Eligibility {

    eligibility = ScenariosData;

    screen(scenarios) {
        let eligibility = {};
        for (let benefit in scenarios) {
            let found = null;
            const bdata = benefit in this.eligibility ? this.eligibility[benefit] : [];
            for (let r of bdata) {
                let match = true;
                if (!r.enabled) {
                    match = false;
                } else {
                    for (const c of Object.keys(r.conditions)) {
                        if (scenarios[benefit][c] !== r.conditions[c]) {
                            match = false;
                        }
                    }
                }
                if (match) {
                    found = r;
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
