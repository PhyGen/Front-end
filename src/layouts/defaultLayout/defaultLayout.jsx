import React from 'react';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const DefaultLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-blue-100">
            <Navbar />
            <div className="flex flex-1 p-8 gap-8 max-lg:flex-col max-lg:p-2">
                <Sidebar />
                <main className="flex-1 min-w-0">{children}</main>
            </div>
        </div>
    );
};

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
