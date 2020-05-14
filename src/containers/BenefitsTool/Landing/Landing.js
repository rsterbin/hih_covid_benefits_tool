import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Intro from '../../../components/BenefitsTool/Intro/Intro';

class Landing extends Component {

    startQuiz = () => {
        this.props.clearAnswers();
        this.props.history.push('/quiz');
    };

    render() {
        return <Intro clicked={this.startQuiz} />;
    }
}

export default withRouter(Landing);
