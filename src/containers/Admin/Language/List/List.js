import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import SelectFilters from '../../../../components/UI/SelectFilters/SelectFilters';
import SearchFilters from '../../../../components/UI/SearchFilters/SearchFilters';
import Table from '../../../../components/UI/Table/Table';
import Message from '../../../../components/UI/Message/Message';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

const MAX_KEY_LENGTH = 50;
const MAX_ENGLISH_LENGTH = 100;
const SKIP_SECTIONS = [ 'results_resources', 'results_processing' ];

class AdminLanguageList extends Component {
    
    state = {
        filter: {
            section: null,
            search: null
        },
    };

    snip = {
        key: MAX_KEY_LENGTH,
        english: MAX_ENGLISH_LENGTH
    };

    clickable = {
        edit: (row) => { this.editRow(row); }
    };

    refresh = () => {
        this.props.fetch();
    };

    setSectionFilter = (e) => {
        let newFilter = { ...this.state.filter };
        newFilter.section = e.target.value;
        this.setState({ filter: newFilter });
    };

    doSearch = (e) => {
        let newFilter = { ...this.state.filter };
        newFilter.search = e.target.value.toLowerCase();
        this.setState({ filter: newFilter });
    };

    clearSearch = (e) => {
        e.preventDefault();
        let newFilter = { ...this.state.filter };
        newFilter.search = null;
        this.setState({ filter: newFilter });
    };

    editRow(row) {
        this.props.history.push('/admin/language/edit/' + row.key);
    }

    componentDidMount() {
        Logger.setComponent('Admin/Language/List');
        this.props.fetch();
    }

    filterRows() {
        let base = [];
        const section = this.state.filter.section || this.getSection();
        if (section) {
            for (const info of this.props.data[section]) {
                base.push({ ...info, section: section });
            }
        } else {
            for (const s in this.props.data) {
                for (const info of this.props.data[s]) {
                    if (SKIP_SECTIONS.includes(s)) {
                        continue;
                    }
                    base.push({ ...info, section: s });
                }
            }
        }
        return base.filter((row) => {
            if (this.state.filter.search) {
                if (!row.english) {
                    return false;
                } else if (row.english.toLowerCase().includes(this.state.filter.search)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        });
    }

    getSection() {
        if (this.props.match.params.section) {
            return this.props.match.params.section;
        }
        return null;
    }

    render() {
        Logger.setComponent('Admin/Language/List');
        let body = null;
        if (this.props.loaded) {
            let cols = [
                { key: 'key', title: 'Key' },
                { key: 'english', title: 'English' },
                { key: 'edit', title: 'Edit' }
            ];
            let filterBySection = null;
            if (this.getSection() === null) {
                cols.unshift({ key: 'section', title: 'Section' });
                const options = Object.keys(this.props.data)
                    .map(section => {
                        return { value: section, text: section };
                    });
                const selectProps = [{
                    label: 'Filter by Section',
                    name: 'section',
                    options: options
                }];
                filterBySection = (
                    <SelectFilters
                        selects={selectProps}
                        empty="any"
                        changed={this.setSectionFilter} />
                );
            }
            const searches = [{
                label: 'Search',
                name: 'search',
                value: this.state.filter.search
            }];
            const rows = this.filterRows().map(row => {
                let tablerow = {
                    key: row.key,
                    english: row.english,
                    edit: <i className="fas fa-pencil-alt" title="Edit Language"></i>
                };
                if (this.getSection() === null) {
                    tablerow.section = row.section;
                }
                return tablerow;
            });
            body = (
                <Aux>
                    {filterBySection}
                    <SearchFilters
                        searches={searches}
                        changed={this.doSearch}
                        cleared={this.clearSearch} />
                    <Table
                        rows={rows}
                        cols={cols}
                        clickable={this.clickable}
                        snip={this.snip} />
                </Aux>
            );
        } else {
            body = (
                <Aux>
                    {this.props.error ?
                        <Message type="error" text={this.props.error} tryagain={this.refresh} />
                    : null}
                    <Spinner />
                </Aux>
            );
        }
        let title = 'Language';
        let crumbs = ['Admin', 'Language', 'List'];
        let section = this.getSection();
        if (section === null) {
            title += ': All language used in the user-facing site';
        } else {
            let sectitle = section.split('_')
                .map(w => w.replace(w[0], w[0].toUpperCase()))
                .join(' ');
            title += ': ' + sectitle + ' Section';
            crumbs.push(sectitle);
        }
        return (
            <AdminPage
                title={title}
                breadcrumbs={crumbs}>
                {body}
            </AdminPage>
        );
    }
}

const mapStateToProps = state => {
    return {
        loaded: state.admin.language.list.loaded,
        error: state.admin.language.list.error,
        data: state.admin.language.list.data
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetch: () => dispatch(actions.loadLangList()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminLanguageList));
