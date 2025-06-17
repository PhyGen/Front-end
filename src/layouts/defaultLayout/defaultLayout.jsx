import React from 'react';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';

const DefaultLayout = ({ children }) => {
    const { selectedKey, setSelectedKey } = useSidebar();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar/>
            <div className="flex flex-1 p-6 gap-6 max-lg:flex-col max-lg:p-4">
                <Sidebar activeKey={selectedKey} onSelect={setSelectedKey} />
                <main className="flex-1 min-w-0 bg-transparent">
                    <div className="space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
