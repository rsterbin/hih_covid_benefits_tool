import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Aux/Aux';
import Layout from '../../hoc/Layout/Layout';
import BenefitsTool from '../../containers/BenefitsTool/BenefitsTool';
import Admin from '../../containers/Admin/Admin';
import CookieNotice from '../CookieNotice/CookieNotice';
import Language from '../../utils/Language';

class Main extends Component {

    state = {
        loaded: false
    };

    componentDidMount() {
        this.lang = {
            layout: {
                logo_alt_text: Language.get('layout_logo_alt_text'),
                header_title: Language.get('layout_header_title')
            }
        };
        this.setState({ loaded: true });
    }

    render() {
        if (!this.state.loaded) {
            return <Spinner />;
        }

        return (
            <Layout lang={this.lang.layout}>
                <Switch>
                    <Route path="/admin" component={Admin} />
                    <Route path="/" render={() => (
                        <Aux>
                            <BenefitsTool />
                            <CookieNotice />
                        </Aux>
                    )} />
                </Switch>
            </Layout>
        );
    }
}

export default Main;
