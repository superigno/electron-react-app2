import React from 'react';
import { Navbar, NavbarGroup, NavbarDivider, Button, Classes, Alignment, Intent, Colors, Icon, Alert } from '@blueprintjs/core';
import { ToggleAdvancedMode } from './ToggleAdvancedMode';
import Path from 'path';
import ConfigUtils from './util/ConfigUtils';
import { ImportConfigObjectType } from './type/Types';

type NavBarProps = {
    onCreateNew: () => void,
    onImport: (configObjects: ImportConfigObjectType[], error: string) => void
    isAdvancedMode: boolean,
    onToggleAdvancedMode: (e: any) => void
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
        const filePath = e.target.files[0].path;
        e.target.value = ''; //Reset to allow importing the same file
        const filetype = Path.extname(filePath).toLowerCase();

        if (filetype != '.xml') {
            props.onImport([], 'File type is invalid: ' + filetype);
            return;
        }

        ConfigUtils.convertConfigFileToObject(filePath).then((result: ImportConfigObjectType[]) => {
            props.onImport(result, '');
        }).catch((err: string) => {
            props.onImport([], err);
        });        
    }

    const handleOnCreateNew = () => {
        setAlertOpen(false);
        props.onCreateNew();
    }

    return <Navbar style={{ background: Colors.BLUE2, position: 'fixed', top: '0' }}>
        <div style={{ color: Colors.WHITE }}>
            <NavbarGroup align={Alignment.LEFT}>
                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE }} onClick={handleAlertOpen}>
                    <Icon color={Colors.WHITE} icon="document" style={{ paddingRight: '15px' }} />Create New
                </Button>
                <NavbarDivider />
                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE }} onClick={() => inputFile.current.click()} >
                    <Icon color={Colors.WHITE} icon="folder-open" style={{ paddingRight: '15px' }} />Import Existing
                    <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={handleOnFileImport} />
                </Button>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT} >
                <div className="toggleAdvanced">
                    <ToggleAdvancedMode checked={props.isAdvancedMode} onChange={props.onToggleAdvancedMode} />
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