import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';

function DefaultLayout({ children }) {
    return (
        <div className='App'>
            <Header />
            <div className='container'>
                <div className='content'>{children}</div>
            </div>
            <Footer/>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
