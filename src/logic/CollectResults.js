
import Screening from './results/Screening';
import Eligibility from './results/Eligibility';
import ProcessText from './results/ProcessText';
import Resources from './results/Resources';
import Language from '../utils/Language';

import BenefitsData from '../data/benefits.json';

class CollectResults {

    benefits = BenefitsData;

    compile(answerKey) {

        // Calculate benefits
        const scenarios = Screening.getScenarios(answerKey);
        const eligibility = Eligibility.screen(scenarios);

        // Switch on employee type replacement
        ProcessText.setEmployeeType(answerKey.type);

        // Build text sections and resource links
        let results = {
            header: ProcessText.process('results_main_header'),
            sections: this.getAllSections(eligibility, answerKey),
            resources_header: ProcessText.process('results_resources_header'),
            resources_intro: ProcessText.process('results_resources_intro'),
            resources: this.getOtherResources(eligibility)
        };

        return results;
    }

    getAllSections(eligibility, answerKey) {
        let sections = [];
        
        // Push all benfit responses into sections
        const benefitSections = this.getBenefitSections(eligibility);

        // If we found nothing, add the no-results text
        if (benefitSections.length < 1) {
            sections.push({
                type: 'no_benefits',
                header: null,
                text: ProcessText.process('results_no_benefits')
            });
        }

        // Otherwise, add an intro and the benefits
        else {
            sections.push({
                header: null,
                text: ProcessText.process('results_intro')
            });
            for (let section of benefitSections) {
                sections.push(section);
            }
        }

        // Do we need an on-the-books section?
        let books = this.getBooksSection(answerKey);
        if (books !== null) {
            sections.push(books);
        }

        // Always add the retaliation warning section
        sections.push({
            type: 'warning',
            header: ProcessText.process('results_retaliation_warning_header'),
            text: ProcessText.process('results_retaliation_warning_text')
        });

        return sections;
    }

    getBenefitSections(eligibility) {
        const benefitSections = [];
        for (const benefit of this.benefits.order) {
            const header = Language.get('results_section_header_' + benefit);
            if (benefit in eligibility) {
                const result = ProcessText.process(eligibility[benefit].lang_key_result);
                const expanded = ProcessText.process(eligibility[benefit].lang_key_expanded);
                const resources = Resources.getBenefitResources(eligibility, benefit);
                let section = {
                    type: 'benefit',
                    header: header,
                    text: result,
                    read_more: expanded,
                    resources_header: Language.get('results_section_resources_header'),
                    resources: []
                };
                for (const r of resources) {
                    section.resources.push({
                        text: ProcessText.process(r.text),
                        link: r.link
                    });
                }
                benefitSections.push(section);
            }
        }
        return benefitSections;
    }

    getBooksSection(answerKey) {
        // totally in compliance; skip
        if (answerKey.books === 'A') {
            return null;
        }

        // partial compliance: message about insurance
        if (answerKey.books === 'B') {
            return {
                header: ProcessText.process('results_off_the_books_partial_header'),
                text: ProcessText.process('results_off_the_books_partial_text')
            };
        }

        // no to on the books: message about getting on
        return {
            type: 'books',
            header: ProcessText.process('results_off_the_books_header'),
            text: ProcessText.process('results_off_the_books_text')
        };
    }

    getOtherResources(eligibility) {
        let links = [];
        const resources = Resources.getOtherResources();
        for (let r of resources) {
            links.push({
                text: ProcessText.process(r.text),
                link: r.link
            });
        }
        return links;
    }

}

export default new CollectResults();
