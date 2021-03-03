import React from 'react';
import { Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button, Classes, Alignment, Intent, Colors, Icon, Alert, Overlay } from '@blueprintjs/core';
import { ConfigTypes } from './Configuration';

type NavBarProps = {
    onCreateNew: (configType: string) => void,
    onImport: (filePath: string) => void
}

export const NavigationBar = (props: NavBarProps) => {

    const inputFile = React.useRef(null)
    const [isAlertOpen, setAlertOpen] = React.useState(false);
    const [isOverlayOpen, setOverlayOpen] = React.useState(true);
    const [configType, setConfigType] = React.useState("");

    const handleOverlayOpen = () => (
        setOverlayOpen(true)
    );
    const handleOverlayCancel = () => (
        setOverlayOpen(false)
    );

    const handleAlertOpenAll = () => {
        if (configType) {
            setAlertOpen(true);
        } else {
            setOverlayOpen(false);
            props.onCreateNew(ConfigTypes.ALL);
        }
        setConfigType(ConfigTypes.ALL);
    };
    const handleAlertOpenOperations = () => {
        if (configType) {
            setAlertOpen(true);
        } else {
            setOverlayOpen(false);
            props.onCreateNew(ConfigTypes.OPERATIONS);
        }
        setConfigType(ConfigTypes.OPERATIONS);
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
        setOverlayOpen(false);
        props.onCreateNew(configType);
    }

    return <Navbar style={{ background: Colors.BLUE2 }}>
        <div style={{ color: Colors.WHITE }}>
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>Pure Commerce</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT} >

                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE }} onClick={handleOverlayOpen}>
                    <Icon color={Colors.WHITE} icon="document" style={{ paddingRight: '15px' }} />Create New
                </Button>
                <NavbarDivider />
                <Button className={Classes.MINIMAL} style={{ color: Colors.WHITE }} onClick={() => inputFile.current.click()} >
                    <Icon color={Colors.WHITE} icon="folder-open" style={{ paddingRight: '15px' }} />Import Existing
                    <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={handleOnFileImport} />
                </Button>

            </NavbarGroup>


            <Overlay isOpen={isOverlayOpen} onClose={handleOverlayCancel}>

                <div className={"overlay"}>
                    <h3>Select Configuration Type</h3>

                    <div className={'config-type'}>
                        <Button className={Classes.MINIMAL} style={{ textAlign: 'center' }} onClick={handleAlertOpenAll}>
                            <div style={{ paddingBottom: '10px' }}>
                                <Icon icon={'document'} iconSize={50} color={Colors.GRAY3} />
                            </div>
                            <h6 className="bp3-heading">Complete</h6>
                            <div>Contains all FxChoice attributes</div>
                        </Button>
                    </div>

                    <div className={'config-type'}>
                        <Button className={Classes.MINIMAL} style={{ textAlign: 'center' }} onClick={handleAlertOpenOperations}>
                            <div style={{ paddingBottom: '10px' }}>
                                <Icon icon={'document'} iconSize={50} color={Colors.GRAY3} />
                            </div>
                            <h6 className="bp3-heading">Operations</h6>
                            <div>Contains FxChoice attributes used by Operations Team</div>
                        </Button>
                    </div>

                    <div style={{ paddingTop: '30px' }}>
                        <Button intent={Intent.NONE} onClick={handleOverlayCancel} text="Close" />
                    </div>
                </div>
            </Overlay>

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