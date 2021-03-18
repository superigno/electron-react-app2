import React from 'react';
import { Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button, Classes, Alignment, Intent, Colors, Icon, Alert, Overlay, Tooltip, Switch } from '@blueprintjs/core';
import { ToggleAdvancedMode } from './ToggleAdvancedMode';
import fs from 'fs';
import Path from 'path';
import xml2js from 'xml2js';

type NavBarProps = {
    onCreateNew: () => void,
    onImport: (configObjects: ImportConfigObjectType[], error: string) => void
    isAdvancedMode: boolean,
    onToggleAdvancedMode: (e:any) => void
}

type ImportConfigType = {
    configuration: {
        item: {
            $: {
                name: string,
                value: string
            }
        }[]
    }
}

export type ImportConfigObjectType = {
    itemName: string,
    itemValue: string
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
            props.onImport([], 'File type is invalid: '+filetype);
            return;
        }

        const parser = new xml2js.Parser();
        fs.readFile(filePath, function (err, data) {
            parser.parseStringPromise(data)
                .then((result: ImportConfigType) => {
                    
                    const configObject: ImportConfigObjectType[] = result.configuration.item.map(item => {
                        return {itemName: item.$.name, itemValue: item.$.value};
                    })
                    props.onImport(configObject, '');

                }).catch(function (err) {
                    props.onImport([], 'Error parsing file: '+filePath+' '+err);                    
                });
        });
        
    }

    const handleOnCreateNew = () => {
        setAlertOpen(false);
        props.onCreateNew();
    }

    return <Navbar style={{ background: Colors.BLUE2, position: 'fixed', top: '0' }}>
        <div style={{ color: Colors.WHITE }}>
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>Pure Commerce</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT} >

                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE}} onClick={handleAlertOpen}>
                    <Icon color={Colors.WHITE} icon="document" style={{ paddingRight: '15px' }} />Create New
                </Button>
                <NavbarDivider />
                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE}} onClick={() => inputFile.current.click()} >
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