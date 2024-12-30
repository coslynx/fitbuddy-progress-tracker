import React, { FC } from 'react';

const Footer: FC = () => {
    // Get the current year
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background p-4 text-center text-gray-500 text-sm shadow-md">
            <p>
                {currentYear} Fitness Tracker. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;