import React from 'react';

const Header: React.FC = () => {
    return (
        <header style={headerStyle}>
            <h1>My Application</h1>
        </header>
    );
};

const headerStyle: React.CSSProperties = {
    backgroundColor: '#282c34',
    padding: '10px',
    color: 'white',
    textAlign: 'center'
};

export default Header;