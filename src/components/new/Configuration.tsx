import React from 'react';
import { Footer } from '../Footer';
import { MultiSelectItem } from '../MultiSelectItem';
import { SelectItem } from '../SelectItem';
import { ItemGroup, ItemGroupType } from './ItemGroup';
import { Button, Icon, Intent, Spinner, Switch, TextArea, Tooltip } from '@blueprintjs/core';
import SchemaFactory from './SchemaFactory';
import AppConstants from './constant/AppConstants';
import df from 'd-forest';
import Utils from './util/Utils';
import { NavigationBar } from './NavigationBar';

const TERMINAL_LIST = Object.values(AppConstants.TERMINALS);
const PAYMENT_TYPE_LIST = Object.values(AppConstants.PAYMENT_TYPES);

const isTerminalHidden = (terminal: string, activeTerminals: string[]) => {
    return activeTerminals.indexOf(terminal) == -1;
}

//Custom hook to run 'func' if 'key' changes, but not on initial render
const useEffectCustom = (func: any, key: any) => {
    const initialized = React.useRef(false);
    React.useEffect(() => {
        if (initialized.current) {
            func();
        } else {
            initialized.current = true;
        }
    }, key);
}

export const Configuration = () => {

    const [operationsSchema, setOperationsSchema] = React.useState(SchemaFactory.getOperationsSchema())
    const [terminalSchemas, setTerminalSchemas] = React.useState(SchemaFactory.getAllTerminalSchemas());

    const [activeTerminals, setActiveTerminals] = React.useState([]);
    const [cardSchemes, setCardSchemes] = React.useState();
    const [paymentTypes, setPaymentTypes] = React.useState([]);
    const [paymentTypeTerminalMapping, setPaymentTypeTerminalMapping] = React.useState([{ paymentType: "", terminal: "" }]);
    const [terminalHidden, setTerminalHidden] = React.useState({} as any);
    const [isAdvanced, setIsAdvanced] = React.useState(false);

    const [formVars, setFormVars] = React.useState({} as any);

    const [isLoading, setIsLoading] = React.useState(false);
    const [toggleReload, setToggleReload] = React.useState(false);

    const initActiveTerminalsList = () => {
        setActiveTerminals(df(operationsSchema).findLeaf((leaf: any) => leaf.name === 'TERMINAL_NAME').value);
    }

    const initCardSchemesList = () => {
        setCardSchemes(df(operationsSchema).findLeaf((leaf: any) => leaf.name === 'TERMINAL_CARD_SCHEME').value);
    }

    const initPaymentTypesAndTerminalMapping = () => {
        const paymentScheme = df(operationsSchema).findLeaf((leaf: any) => leaf.name === 'TERMINAL_PAYMENT_SCHEME');
        const mappingArr: string[] = paymentScheme.value.split(",");
        const paymentTypeTerminalMapping = mappingArr.map(m => {
            const paymentTypeTerminalArr = m.split(":");
            return {
                paymentType: paymentTypeTerminalArr[0],
                terminal: paymentTypeTerminalArr[1]
            };
        });

        const paymentTypes = paymentTypeTerminalMapping.map(pt => {
            return pt.paymentType;
        })

        setPaymentTypeTerminalMapping(paymentTypeTerminalMapping);
        setPaymentTypes(paymentTypes);
    }

    /** Initialize states on initial load or 'Create New' */
    React.useEffect(() => {
        console.log('Init states');
        initActiveTerminalsList();
        initCardSchemesList();
        initPaymentTypesAndTerminalMapping();
    }, [toggleReload]);


    /** Hide respective terminals when selected terminals change */
    React.useEffect(() => {
        setTerminalHidden((current: any) => {
            TERMINAL_LIST.map((terminal) => {
                current[terminal] = isTerminalHidden(terminal, activeTerminals);
            })
            return { ...current };
        })
    }, [activeTerminals]);

    /** If selected terminals or payment types changes, update the mapping; used custom hook since it also runs on initial render when setPaymentTypes is run */
    useEffectCustom(() => {

        setPaymentTypeTerminalMapping(current => {
            return paymentTypes.map(pt => {
                const curr = current.filter(curr => {
                    return curr.paymentType == pt;
                });

                if (curr && curr.length > 0) {
                    return { ...curr[0], terminal: (activeTerminals.indexOf(curr[0].terminal) > -1 ? curr[0].terminal : "") };
                } else {
                    return { paymentType: pt, terminal: "" };
                }
            });
        });

    }, [activeTerminals, paymentTypes]);


    /** Fill 'TERMINAL_PAYMENT_SCHEME' form value on init or payment type/terminal mapping change */
    React.useEffect(() => {
        const ptArr: string[] = [];
        paymentTypeTerminalMapping.map(pt => {
            if (pt.terminal) {
                ptArr.push(`${pt.paymentType}:${pt.terminal}`);
            }
        })
        handleOnChange("TERMINAL_PAYMENT_SCHEME", ptArr);
    }, [paymentTypeTerminalMapping]);


    const handlePaymentTypeChange = (items: string[]) => {
        setPaymentTypes(items);
    }

    const handleTerminalChange = (items: string[]) => {
        setActiveTerminals(items);
        handleOnChange("TERMINAL_NAME", items);
    }

    const handlePaymentTerminalChange = ((paymentType: string, terminal: string) => {
        setPaymentTypeTerminalMapping(current => {
            return current.map(curr => {
                if (curr.paymentType == paymentType) {
                    return { ...curr, terminal: terminal };
                } else {
                    return { ...curr };
                }
            });
        });
    });


    const handleOnChange = (itemName: string, itemValue: string | string[]) => {
        formVars[itemName] = itemValue;
    }


    const handleToggleAdvanced = (e: any) => {
        setIsAdvanced(e.target.checked);
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

        Utils.generateConfigurationFile(schemaGroups, formVars);

    }

    const reload = () => {
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

            setOperationsSchema({ groups: groupsArray })


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

    return <>

        <NavigationBar onCreateNew={handleOnCreateNew} onImport={handleOnFileImport} isAdvancedMode={isAdvanced} onToggleAdvancedMode={handleToggleAdvanced} />

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
                <div className="content">
                    <Spinner />
                </div>
            }

            {!isLoading &&

                <div className="content">

                    {
                        operationsSchema.groups.filter(group => {
                            return group.name.toUpperCase() == 'VERSION' || group.name.toUpperCase() == 'MODES'; //Filtering just to display these two sections at the very top
                        }).map(group => {
                            return <ItemGroup key={group.name} group={group} onChange={handleOnChange} />
                        })
                    }

                    <div className="item-group">

                        <div>
                            <h6 className="bp3-heading group-name">Select Terminals and Assign to Payment Types</h6>
                        </div>

                        <div>
                            <div className="contentRow">
                                <div className="label">
                                    Select Terminal/s
                                </div>

                                <div className="item2">
                                    <MultiSelectItem values={activeTerminals} options={TERMINAL_LIST} onSelect={handleTerminalChange} />
                                </div>
                            </div>

                            <div className="contentRow">
                                <div className="label">
                                    Select Payment Type/s
                                </div>

                                <div className="item2">
                                    <MultiSelectItem values={paymentTypes} options={PAYMENT_TYPE_LIST} onSelect={handlePaymentTypeChange} />
                                </div>
                            </div>

                            {isAdvanced &&
                                <div className="contentRow">
                                    <div className="label">
                                        Terminal Card Scheme
                                </div>

                                    <div className="item2">
                                        <TextArea value={cardSchemes} growVertically={true} cols={80} onChange={(e) => handleOnChange(null, e.target.value)} />
                                    </div>
                                </div>
                            }

                            {
                                paymentTypeTerminalMapping.map((m: { paymentType: string, terminal: string }) => {

                                    return <div className="contentRow" key={m.paymentType}>
                                        <div className="label">
                                            {m.paymentType}
                                        </div>
                                        <div className="item2">
                                            <SelectItem onSelect={(id, val) => handlePaymentTerminalChange(m.paymentType, val)} value={m.terminal}
                                                options={activeTerminals.map((value: any, index: any) => ({ value, id: index + 1 }))} />
                                        </div>
                                    </div>

                                })

                            }
                        </div>

                    </div>

                    {
                        TERMINAL_LIST.map((terminal: string) => {
                            return <ItemGroup key={terminal} hidden={terminalHidden[terminal]} advanced={isAdvanced} group={terminalSchemas[terminal]} onChange={handleOnChange} />
                        })
                    }

                    {
                        operationsSchema.groups.filter(group => {
                            return group.name.toUpperCase() != 'VERSION' && group.name.toUpperCase() != 'MODES' && group.name.toUpperCase() != 'TERMINALS'; //Filtering since these are already displayed at the top
                        }).map(group => {
                            return <ItemGroup key={group.name} group={group} advanced={isAdvanced} onChange={handleOnChange} />
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