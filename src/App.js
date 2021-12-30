import React, { useState } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import Header from './components/Header/Header';

export default () => {
    const [selected, setSelected] = useState(options[0]);
    return (
        <div>
            <Header />
            {/* <Route path="/dropdown">
                <Dropdown 
                    label="Select a color"
                    options={options}
                    selected={selected}
                    onSelectedChange={setSelected}
                />
            </Route> */}
            <Route path="/dashboard">
                <Dashboard/>
            </Route>
        </div>
    );
};