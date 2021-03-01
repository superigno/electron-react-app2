import React from 'react';
import { Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button, Classes, Alignment, Intent, Colors, Icon, Alert } from '@blueprintjs/core';

type NavBarProps = {
    onCreateNew: () => void,
    onImport: (filePath: string) => void
}

export const NavigationBar = (props: NavBarProps) => {

    const inputFile = React.useRef(null)
    const [isAlertOpen, setAlertOpen] = React.useState(false);

    const handleAlertOpen = () => (
        setAlertOpen(true)
    );
    const handleAlertCancel = () => (
        setAlertOpen(false)
    );

    const handleOnFileImport = (e: any) => {
        console.log('File:', e.target.files[0].path);
        const filePath = e.target.files[0].path;
        props.onImport(filePath);
    }

    const handleOnCreateNew = () => {
        setAlertOpen(false);
        props.onCreateNew();
    }

    return <Navbar style={{ background: Colors.BLUE2 }}>
        <div style={{ color: Colors.WHITE }}>
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>Pure Commerce</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT} >

                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE }} onClick={handleAlertOpen}>
                    <Icon color={Colors.WHITE} icon="document" style={{ paddingRight: '15px' }} />Create New
                </Button>
                <NavbarDivider />
                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE }} onClick={() => inputFile.current.click()} >
                    <Icon color={Colors.WHITE} icon="folder-open" style={{ paddingRight: '15px' }} />Import Existing
                    <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={handleOnFileImport} />
                </Button>

            </NavbarGroup>

            <Alert
                        cancelButtonText="Cancel"
                        confirmButtonText="Okay"
                        icon="document"
                        intent={Intent.PRIMARY}
                        isOpen={isAlertOpen}
                        onCancel={handleAlertCancel}
                        onConfirm={handleOnCreateNew}
                    >
                        <p>This will clear all changes made. Proceed?</p>

                    </Alert>

        </div>
    </Navbar>
}