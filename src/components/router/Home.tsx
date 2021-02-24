import React from 'react';
import NavigationBar from './NavigationBar';

export const Home = () => {
    return <>
        <NavigationBar />        
        <div className="wrapper">
            This is a sample home page using react-router-dom
        </div>
    </>
}