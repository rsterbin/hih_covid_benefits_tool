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
    clearAnswers = () => {
        this.props.clearAnswers();
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

        const doQuiz = () => <Quiz
            visitor_id={this.props.visitor_id}
            answers={this.props.answers}
            saveAnswer={this.saveAnswer} />;

        const doConfirmation = () => <Confirmation
            visitor_id={this.props.visitor_id}
            answers={this.props.answers}
            needsRedirect={this.needsRedirect}
            saveAnswer={this.saveAnswer} />;

        const doResults = () => <Results
            answers={this.props.answers}
            needsRedirect={this.needsRedirect} />;

        const doLanding = () => <Landing
            visitor_id={this.props.visitor_id}
            clearAnswers={this.clearAnswers} />;

        return (
            <div className="BenefitsTool">
                <Switch>
                    <Route path="/quiz/:step" render={doQuiz} />
                    <Route path="/quiz" render={doQuiz} />
                    <Route path="/confirm" render={doConfirmation} />
                    <Route path="/results" render={doResults} />
                    <Route path="/" render={doLanding} />
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
        clearAnswers: () => dispatch(actions.answersClear()),
        saveAnswer: (qcode, letter) => dispatch(actions.answerSave(qcode, letter)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BenefitsTool);
