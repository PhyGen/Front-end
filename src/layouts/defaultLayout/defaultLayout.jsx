import React from 'react';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import Header from '../Header';
import Footer from '../Footer';
import PhyBotChatBox from '../../components/PhyBotChatBox';

const DefaultLayout = ({ children }) => {
    const { selectedKey, setSelectedKey } = useSidebar();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#1e1e1e] transition-colors duration-300">
            <Header/>
            <div className="flex flex-1 p-6 gap-6 max-lg:flex-col max-lg:p-4">
                <Sidebar activeKey={selectedKey} onSelect={setSelectedKey} />
                <main className="flex-1 min-w-0 bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm p-4">
                    <div className="space-y-6">
                        {children}
                    </div>
                </main>
            </div>
            <Footer/>
            <PhyBotChatBox />
        </div>
    );
};

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
