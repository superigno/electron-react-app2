import React from 'react';
import { Footer } from '../Footer';
import { MultiSelectItem } from '../MultiSelectItem';
import { SelectItem } from '../SelectItem';
import { ItemGroup, ItemGroupType } from './ItemGroup';
import { Button, Icon, Intent, Switch, TextArea, Tooltip } from '@blueprintjs/core';
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

    const OPERATIONS_SCHEMA = SchemaFactory.getOperationsSchema();

    const [terminals, setTerminals] = React.useState(df(OPERATIONS_SCHEMA).findLeaf((leaf: any) => leaf.name === 'TERMINAL_NAME').value);
    const [cardSchemes, setCardSchemes] = React.useState(df(OPERATIONS_SCHEMA).findLeaf((leaf: any) => leaf.name === 'TERMINAL_CARD_SCHEME').value);
    const [paymentTypes, setPaymentTypes] = React.useState([]);
    const [paymentTypeTerminalMapping, setPaymentTypeTerminalMapping] = React.useState([{ paymentType: "", terminal: "" }]);
    const [isAdvanced, setIsAdvanced] = React.useState(false);

    const [terminalSchema, setTerminalSchema] = React.useState({} as any);
    const [terminalHidden, setTerminalHidden] = React.useState({} as any);

    const [formVars, setFormVars] = React.useState({} as any);

    /** Init terminal section values from schema */
    React.useEffect(() => {

        const paymentScheme = df(OPERATIONS_SCHEMA).findLeaf((leaf: any) => leaf.name === 'TERMINAL_PAYMENT_SCHEME');
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

    }, []);

    /** Load terminal schemas */
    React.useEffect(() => {
        setTerminalSchema((current: any) => {
            TERMINAL_LIST.map((terminal) => {
                current[terminal] = SchemaFactory.getTerminalSchema(terminal);
            })
            return { ...current };
        })
    }, []);

    /** Hide respective terminals when selected terminals change */
    React.useEffect(() => {
        setTerminalHidden((current: any) => {
            TERMINAL_LIST.map((terminal) => {
                current[terminal] = isTerminalHidden(terminal, terminals);
            })
            return { ...current };
        })
    }, [terminals]);

    /** If selected terminals or payment types changes, update the mapping; used custom hook since it also runs on initial render when setPaymentTypes is run */
    useEffectCustom(() => {
        setPaymentTypeTerminalMapping(current => {
            return paymentTypes.map(pt => {
                const curr = current.filter(curr => {
                    return curr.paymentType == pt;
                });

                if (curr && curr.length > 0) {
                    return { ...curr[0], terminal: (terminals.indexOf(curr[0].terminal) > -1 ? curr[0].terminal : "") };
                } else {
                    return { paymentType: pt, terminal: "" };
                }
            });
        });

    }, [terminals, paymentTypes]);


    /** Hande on change of payment type / terminal mapping */
    React.useEffect(() => {
        console.log('Hereye');
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
        setTerminals(items);
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

        OPERATIONS_SCHEMA.groups.map(group => {
            schemaGroups.push(group);
        });

        terminals.map((terminal: string) => {
            schemaGroups.push(SchemaFactory.getTerminalSchema(terminal));
        });

        console.log('Combined Schemas:', schemaGroups);

        Utils.generateConfigurationFile(schemaGroups, formVars);

    }

    return <>

        <NavigationBar onCreateNew={()=>console.log('TODO')} onImport={()=>console.log('TODO')} isAdvancedMode={isAdvanced} onToggleAdvancedMode={handleToggleAdvanced} />

        <div className="wrapper">

            <div className="header">
                <div className="headerLabel">
                    <h3 className="bp3-heading">Global FxChoice Configuration Manager</h3>
                </div>

                <div className="toggleAdvanced">
                                        
                </div>
            </div>

            <div className="content">                

                {
                    OPERATIONS_SCHEMA.groups.filter(group => {
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
                                <MultiSelectItem values={terminals} options={TERMINAL_LIST} onSelect={handleTerminalChange} />
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
                                            options={terminals.map((value: any, index: any) => ({ value, id: index + 1 }))} />
                                    </div>
                                </div>

                            })

                        }
                    </div>

                </div>

                {
                    TERMINAL_LIST.map((terminal: string) => {
                        return <ItemGroup key={terminal} hidden={terminalHidden[terminal]} advanced={isAdvanced} group={terminalSchema[terminal]} onChange={handleOnChange} />
                    })
                }

                {
                    OPERATIONS_SCHEMA.groups.filter(group => {
                        return group.name.toUpperCase() != 'VERSION' && group.name.toUpperCase() != 'MODES' && group.name.toUpperCase() != 'TERMINALS'; //Filtering since these are already displayed at the top
                    }).map(group => {
                        return <ItemGroup key={group.name} group={group} advanced={isAdvanced} onChange={handleOnChange} />
                    })
                }


            </div>


            <div className="button">
                <Button intent={Intent.PRIMARY} onClick={handleOnSubmit} text="Generate" icon={"export"} large={true} />
            </div>

        </div>

        <Footer />

    </>

};