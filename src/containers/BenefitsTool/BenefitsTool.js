import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import Landing from './Landing/Landing';
import Quiz from './Quiz/Quiz';
import Confirmation from './Confirmation/Confirmation';
import Results from './Results/Results';
import Questions from '../../logic/Questions';
import * as actions from '../../storage/redux/actions/index';

class BenefitsTool extends Component {

    componentDidMount() {
        this.props.fetchVisitor();
        this.props.fetchAnswers();
    }

    // TODO: Remove
    saveAnswer = (qcode, letter) => {
        this.props.saveAnswer(qcode, letter);
        return true;
    };

    // TODO: Remove
    needsRedirect = () => {
        const step = Questions.firstMissingStep(this.props.answers);
        if (step === null) {
            return false;
        }
        if (step < 1) {
            return '/';
        } else {
            return '/quiz/' + step;
        }
    };

    render() {

        if (!this.props.loaded) {
            return <Spinner />;
        }

        const doResults = () => <Results
            answers={this.props.answers}
            needsRedirect={this.needsRedirect} />;

        return (
            <div className="BenefitsTool">
                <Switch>
                    <Route path="/quiz/:step" component={Quiz} />
                    <Route path="/quiz" component={Quiz} />
                    <Route path="/confirm" component={Confirmation} />
                    <Route path="/results" render={doResults} />
                    <Route path="/" component={Landing} />
                </Switch>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        loaded: state.loaded,
        visitor_id: state.visitor_id,
        answers: state.answers
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchVisitor: () => dispatch(actions.visitorFetch()),
        fetchAnswers: () => dispatch(actions.answersFetch()),
        saveAnswer: (qcode, letter) => dispatch(actions.answerSave(qcode, letter)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BenefitsTool);
