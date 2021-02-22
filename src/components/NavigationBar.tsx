import React from 'react';
import { Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button, Classes, Alignment, Intent, Colors, Icon } from '@blueprintjs/core';


export const NavigationBar = () => {
    return <Navbar style={{ background: Colors.BLUE2 }}>
        <div style={{color: Colors.WHITE}}>
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>Pure Commerce</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT} >
                <Button className={Classes.MINIMAL} style={{color: Colors.WHITE}}>
                    <Icon color={Colors.WHITE} icon="home" style={{paddingRight: '15px'}}/>Home
                </Button>
                <NavbarDivider />
                <Button className={Classes.MINIMAL} style={{color: Colors.WHITE}}>
                    <Icon color={Colors.WHITE} icon="document" style={{paddingRight: '15px'}}/>Files
                </Button>
            </NavbarGroup>
        </div>
    </Navbar>
}