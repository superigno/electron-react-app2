import React from 'react';
import { Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button, Classes, Alignment, Intent, Colors, Icon, Alert, Overlay, Tooltip, Switch } from '@blueprintjs/core';
import { ToggleAdvancedMode } from './ToggleAdvancedMode';

type NavBarProps = {
    onCreateNew: (configType: string) => void,
    onImport: (filePath: string) => void
    isAdvancedMode: boolean,
    onToggleAdvancedMode: (e:any) => void
}

export const NavigationBar = (props: NavBarProps) => {

    const inputFile = React.useRef(null)
    const [isAlertOpen, setAlertOpen] = React.useState(false);
       
    const handleAlertOpen = () => {
        setAlertOpen(true);
    };

    const handleAlertCancel = () => {
        setAlertOpen(false);
    };

    const handleOnFileImport = (e: any) => {
        console.log('File:', e.target.files[0].path);
        const filePath = e.target.files[0].path;
        props.onImport(filePath);
    }

    const handleOnCreateNew = () => {
        setAlertOpen(false);
    }

    return <Navbar style={{ background: Colors.BLUE2, position: 'fixed', top: '0' }}>
        <div style={{ color: Colors.WHITE }}>
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>Pure Commerce</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT} >

                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE, width: '110px' }} onClick={handleAlertOpen}>
                    <Icon color={Colors.WHITE} icon="document" style={{ paddingRight: '15px' }} />Create New
                </Button>
                <NavbarDivider />
                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE, width: '150px' }} onClick={() => inputFile.current.click()} >
                    <Icon color={Colors.WHITE} icon="folder-open" style={{ paddingRight: '15px' }} />Import Existing
                    <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={handleOnFileImport} />
                </Button>
                <NavbarDivider />
                <div className="toggleAdvanced">
                    <ToggleAdvancedMode checked={props.isAdvancedMode} onChange={props.onToggleAdvancedMode}/>
                </div>

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
                <p>This will reset all changes made. Proceed?</p>

            </Alert>


        </div>
    </Navbar>
}