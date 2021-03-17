import React from 'react';
import { Footer } from '../Footer';
import { ItemGroup } from './ItemGroup';
import { Button, Intent, Spinner } from '@blueprintjs/core';
import SchemaFactory from './SchemaFactory';
import df from 'd-forest';
import Utils from './util/Utils';
import { NavigationBar } from './NavigationBar';
import { TerminalPaymentMapping } from '../TerminalPaymentMapping';


export const Configuration = () => {

    const [operationsSchema, setOperationsSchema] = React.useState(SchemaFactory.getOperationsSchema())
    const [terminalSchemas, setTerminalSchemas] = React.useState(SchemaFactory.getAllTerminalSchemas());
    const [activeTerminals, setActiveTerminals] = React.useState([]);
    const [isAdvancedMode, setIsAdvancedMode] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [toggleReload, setToggleReload] = React.useState(false);

    const formVars = React.useRef({} as any);

    /** Hide respective terminals when selected terminals change */
    const handleActiveTerminalsChange = (activeTerminals: string[]) => {
        setActiveTerminals(activeTerminals);
    };

    const handleOnChange = (itemName: string, itemValue: string | string[]) => {
        formVars.current[itemName] = itemValue;
    }

    const handleToggleAdvanced = (e: any) => {
        setIsAdvancedMode(e.target.checked);
    }

    const reload = () => {
        formVars.current = {};
        setIsLoading(true);
        setTimeout(() => {
            setToggleReload(currentValue => !currentValue);
            setIsLoading(false);
        }, 3000);
    }

    const handleOnCreateNew = () => {
        setOperationsSchema(SchemaFactory.getOperationsSchema());
        setTerminalSchemas(SchemaFactory.getAllTerminalSchemas());
        reload();
    }

    const handleOnFileImport = (configObj: [], error: string) => {

        if (error) {
            alert(error);
            console.error(error);
        } else {
            const groupsArray = operationsSchema.groups.map(group => {
                const items = group.items.filter((item) => {
                    const match = df(configObj).findLeaf((leaf: any) => leaf.itemName === item.name);
                    if (match) {
                        item.value = getActualValue(item.type, match.itemValue);
                        return true
                    } else {
                        return false;
                    }
                });
                return { ...group, items: items };
            });
            setOperationsSchema({ groups: groupsArray });

            const activeTerminalsFromImport: string[] = df(groupsArray).findLeaf((leaf: any) => leaf.name === 'TERMINAL_NAME').value;
            activeTerminalsFromImport.map(terminal => {
                terminalSchemas[terminal].items.map((item: any) => {
                    const match = df(configObj).findLeaf((leaf: any) => leaf.itemName === item.name);
                    if (match) {
                        item.value = getActualValue(item.type, match.itemValue);
                    }
                    return { ...item };
                });
                setTerminalSchemas((current: any) => {
                    return { ...current, [terminal]: { ...terminalSchemas[terminal] } }
                });
            });

            reload();
        }
    }

    const handleOnSubmit = () => {
        const schemaGroups: any[] = [];
        operationsSchema.groups.map(group => {
            schemaGroups.push(group);
        });
        activeTerminals.map((terminal: string) => {
            schemaGroups.push(terminalSchemas[terminal]);
        });
        console.log('Combined Schemas:', schemaGroups);
        Utils.generateConfigurationFile(schemaGroups, formVars.current);
    }

    return <>

        <NavigationBar onCreateNew={handleOnCreateNew} onImport={handleOnFileImport} isAdvancedMode={isAdvancedMode} onToggleAdvancedMode={handleToggleAdvanced} />

        <div className="wrapper">

            <div className="header">
                <div className="headerLabel">
                    <h3 className="bp3-heading">Global FxChoice Configuration Manager</h3>
                </div>

                <div className="headerLabel">
                    This tool is used to generate basic configuration settings for Global FxChoice. Toggle advanced mode above for additional settings.
                </div>
            </div>

            {isLoading &&
                <div className="content" style={{textAlign: 'center'}}>
                    <Spinner /><br/>
                    Loading...
                </div>
            }

            {!isLoading &&

                <div className="content">
                    {
                        //Filtering just to display these two sections at the very top
                        operationsSchema.groups.filter(group => {
                            return group.name.toUpperCase() == 'VERSION' || group.name.toUpperCase() == 'MODES';
                        }).map(group => {
                            return <ItemGroup key={group.name} group={group} onChange={handleOnChange} />
                        })
                    }

                    <TerminalPaymentMapping operationsSchema={operationsSchema} terminalSchemas={terminalSchemas} isAdvancedMode={isAdvancedMode}
                        toggleReload={toggleReload} onChange={handleOnChange} onActiveTerminalsChange={handleActiveTerminalsChange} />

                    {
                        //Filtering since these are already displayed at the top
                        operationsSchema.groups.filter(group => {
                            return group.name.toUpperCase() != 'VERSION' && group.name.toUpperCase() != 'MODES' && group.name.toUpperCase() != 'TERMINALS';
                        }).map(group => {
                            return <ItemGroup key={group.name} group={group} advanced={isAdvancedMode} onChange={handleOnChange} />
                        })
                    }

                </div>
            }

            <div className="button">
                <Button intent={Intent.PRIMARY} onClick={handleOnSubmit} text="Generate" icon={"export"} large={true} />
            </div>

        </div>

        <Footer />

    </>

};


const getActualValue = (type: string, value: string) => {
    if (type == "multiselect") {
        return value.split(",");
    } else if (type == "number") {
        return Number(value);
    } else if (type == "boolean") {
        return value.toUpperCase() === 'TRUE';
    } else {
        return value;
    }
}