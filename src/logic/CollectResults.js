
import Screening from './results/Screening';
import Eligibility from './results/Eligibility';
import ProcessText from './results/ProcessText';
import Resources from './results/Resources';
import Language from '../utils/Language';

class CollectResults {

    benefits_order = [ 'ffcra', 'nys', 'pssl', 'dwbor', 'cares' ];

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
            resources: this.getAllResources(eligibility)
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
            header: ProcessText.process('results_retaliation_warning_header'),
            text: ProcessText.process('results_retaliation_warning_text')
        });

        return sections;
    }

    getBenefitSections(eligibility) {
        const benefitSections = [];
        for (let benefit of this.benefits_order) {
            let header = Language.get('results_section_header_' + benefit);
            if (benefit in eligibility) {
                let text = ProcessText.process(eligibility[benefit]);
                benefitSections.push({
                    header: header,
                    text: text
                });
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
            header: ProcessText.process('results_off_the_books_header'),
            text: ProcessText.process('results_off_the_books_text')
        };
    }

    getAllResources(eligibility) {
        const b_resources = Resources.getBenefitResources(eligibility);
        const o_resources = Resources.getOtherResources();

        let all = [];

        // Add the benefit resources
        for (let benefit of this.benefits_order) {
            if (benefit in b_resources) {
                let section = {
                    header: Language.get('results_resources_' + benefit + '_header'),
                    links: []
                };
                for (let r of b_resources[benefit]) {
                    section.links.push({
                        text: ProcessText.process(r.text),
                        link: r.link
                    });
                }
                all.push(section);
            }
        }

        // Add the always-include resources
        if (o_resources.length > 0) {
            let section = {
                links: []
            };
            if (all.length > 0) {
                section.header = Language.get('results_resources_other_header');
            }
            for (let r of o_resources) {
                section.links.push({
                    text: ProcessText.process(r.text),
                    link: r.link
                });
            }
            all.push(section);
        }

        return all;
    }

}

export default new CollectResults();
