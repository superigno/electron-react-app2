import React from 'react';
import { Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button, Classes, Alignment, Intent, Colors, Icon } from '@blueprintjs/core';

type NavBarProps = {
    onCreateNew: () => void,
    onImport: (filePath: string) => void
}

export const NavigationBar = (props: NavBarProps) => {

    const inputFile = React.useRef(null)

    const handleOnFileImport = (e: any) => {
        console.log('File:', e.target.files[0].path);
        const filePath = e.target.files[0].path;
        props.onImport(filePath);
    }

    return <Navbar style={{ background: Colors.BLUE2 }}>
        <div style={{ color: Colors.WHITE }}>
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>Pure Commerce</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT} >

                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE }} onClick={props.onCreateNew}>
                    <Icon color={Colors.WHITE} icon="document" style={{ paddingRight: '15px' }} />Create New
                </Button>
                <NavbarDivider />
                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE }} onClick={() => inputFile.current.click()} >
                    <Icon color={Colors.WHITE} icon="folder-open" style={{ paddingRight: '15px' }} />Import Existing
                    <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={handleOnFileImport} />
                </Button>

            </NavbarGroup>
        </div>
    </Navbar>
}