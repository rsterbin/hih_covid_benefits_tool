import React from 'react';

import IconButton from '../IconButton/IconButton';

import './SearchFilters.css';

const searchFilters = (props) => {
    const searches = props.searches.map(search => {
        let clearButton = null;
        if (search.value) {
            clearButton = <IconButton icon="far fa-times-circle"
                title={search.clear_title || 'Clear'}
                clicked={props.cleared} />;
        }
        return (
            <div className="Filter" key={search.label}>
                <label>{search.label}</label>
                <input type="text" name={search.name}
                    size="40"
                    value={search.value || ''}
                    onChange={props.changed} />
                {clearButton}
            </div>
        );
    });
    return (
        <div className="SearchFilters">
            {searches}
        </div>
    );
};

export default searchFilters;
