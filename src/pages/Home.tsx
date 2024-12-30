import React, { FC } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthForm from '../components/AuthForm';

const Home: FC = () => {
    try {
        return (
            <div className="flex flex-col min-h-screen bg-gray-100">
                <Header />
                <main className="flex-grow container mx-auto p-4 flex justify-center items-center">
                        <AuthForm />
                </main>
                <Footer />
            </div>
        );
    } catch (error: any) {
        console.error('Error rendering Home component:', error);
        return null;
    }
};

export default Home;