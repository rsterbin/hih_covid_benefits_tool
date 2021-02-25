import React from 'react';

import SimpleKeys from '../SimpleKeys/SimpleKeys';
import TranslatedText from '../../TranslatedText/TranslatedText';
import { getMatchType, complexOrSimpleData } from '../../../../utils/comparisons';

import './Question.css';

const Question = (props) => {

    const [ mydata, highlight ] = complexOrSimpleData(props);
    if (mydata === null) {
        return null;
    }

    let lang_text = {};
    if ('lang_en' in props.full
        && typeof props.full.lang_en === 'object') {
        lang_text = props.full.lang_en;
    }
    const keyWithTranslation = (lang_key) => {
        return <TranslatedText lang_key={lang_key} translations={lang_text} />
    };

    const addMatchType = (pair) => {
        const mt = getMatchType(pair.key, highlight);
        if (mt) {
            pair.matchType = mt;
        }
        return pair;
    };

    let pairs = [];

    pairs.push(addMatchType({
        key: 'full_lang_key',
        label: 'Full question',
        display: keyWithTranslation(mydata.full_lang_key)
    }));

    pairs.push(addMatchType({
        key: 'title_lang_key',
        label: 'Question title',
        display: keyWithTranslation(mydata.title_lang_key)
    }));

    let hl = {};
    if (highlight !== null && 'answers' in highlight) {
        if (getMatchType('answers', highlight) === 'complexDiff') {
            hl = highlight.answers.diff;
        }
    }
    const answers = (
        <table className="AnswersList">
            <thead>
                <tr>
                    <th className="Letter">Letter</th>
                    <th className="Text">Answer Text</th>
                </tr>
            </thead>
            <tbody>
            {mydata.answers.map(answer => {
                let c = null;
                if (answer.letter in hl) {
                    c = getMatchType(answer.letter, hl);
                }
                return (
                    <tr key={answer.letter} className={c}>
                        <td className="Letter">{answer.letter}</td>
                        <td className="Text">{keyWithTranslation(answer.lang_key)}</td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
    pairs.push(addMatchType({
        key: 'answers',
        label: 'Answers',
        display: answers
    }));

    pairs.push(addMatchType({
        key: 'layout',
        label: 'Answer button layout',
        display: mydata.layout === 'vert' ? 'vertical' : 'horizontal'
    }));

    return (
        <div className="Question">
            <SimpleKeys pairs={pairs} />
        </div>
    );

/*

    "type": {
      "full_lang_key": "quiz_type_question",
      "title_lang_key": "quiz_type_short",
      "help_lang_key": "quiz_type_help",
      "layout": "vert",
      "answers": [
        {
          "letter": "A",
          "lang_key": "quiz_type_answer_a"
        },
        {
          "letter": "B",
          "lang_key": "quiz_type_answer_b"
        },
        {
          "letter": "C",
          "lang_key": "quiz_type_answer_c"
        },
        {
          "letter": "D",
          "lang_key": "quiz_type_answer_d"
        }
      ]
    }

 */


};

export default Question;
