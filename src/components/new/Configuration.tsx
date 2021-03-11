import React from 'react';
import { Footer } from '../Footer';
import { MultiSelectItem } from '../MultiSelectItem';
import { SelectItem } from '../SelectItem';
import { ItemGroup, ItemGroupType } from './ItemGroup';
import { Icon, Switch, TextArea, Tooltip } from '@blueprintjs/core';
import TerminalFactory from './TerminalFactory';
import operations_schema from '../../../resources/schemas/operations_schema.json';
import AppConstants from '../constants/AppConstants';
import df from 'd-forest';

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

    const [terminals, setTerminals] = React.useState([]);
    const [paymentTypes, setPaymentTypes] = React.useState([]);
    const [cardSchemes, setCardSchemes] = React.useState("")
    const [paymentTypeTerminalMapping, setPaymentTypeTerminalMapping] = React.useState([{ paymentType: "", terminal: "" }]);
    const [isBasic, setIsBasic] = React.useState(true);

    const [terminalSchema, setTerminalSchema] = React.useState({} as any);
    const [terminalHidden, setTerminalHidden] = React.useState({} as any);


    /** Init terminal section values from schema */
    React.useEffect(() => {

        const terminal = df(operations_schema).findLeaf((leaf: any) => leaf.name === 'TERMINAL_NAME');
        setTerminals(terminal.value);

        const cardSchemes = df(operations_schema).findLeaf((leaf: any) => leaf.name === 'TERMINAL_CARD_SCHEME');
        setCardSchemes(cardSchemes.value);

        const paymentScheme = df(operations_schema).findLeaf((leaf: any) => leaf.name === 'TERMINAL_PAYMENT_SCHEME');
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
                current[terminal] = TerminalFactory.getSchema(terminal);
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


    /** If selected terminals or payment types changes, update the mapping; used custom hook since it also runs on initial render when setTerminals is run */
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

    const handlePaymentTypeChange = (items: string[]) => {
        setPaymentTypes(items);
    }

    const handleTerminalChange = (items: string[]) => {
        setTerminals(items);
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

    const handleGenericOnChange = (id: string, val: string) => {
        console.log('Val:', val);
    }

    const handleToggleBasic = (e: any) => {
        setIsBasic(e.target.checked);
    }

    return <>

        <div className="wrapper">

            <h3 className="bp3-heading">Global FxChoice Configuration Manager</h3>

            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>

            <div className="content">

                <div className="basic">
                    <div style={{ display: 'inline-block' }}>
                        <Tooltip content={"Toggle to only view basic terminal configurations"} minimal={true} >
                            <Icon icon="issue" iconSize={13} style={{ verticalAlign: 'top' }} />
                        </Tooltip>
                        &nbsp;Toggle Basic Mode&nbsp;
                    </div>
                    <div style={{ display: 'inline-block' }}>
                        <Switch checked={isBasic} onChange={handleToggleBasic} innerLabelChecked="On" innerLabel="Off" />
                    </div>
                </div>

                {
                    operations_schema.groups.filter(group => {
                        return group.name.toUpperCase() == 'VERSION' || group.name.toUpperCase() == 'MODES'; //Filtering just to display these two sections at the very top
                    }).map(group => {
                        return <ItemGroup key={group.name} group={group} onChange={handleGenericOnChange} />
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

                        {!isBasic &&
                            <div className="contentRow">
                                <div className="label">
                                    Terminal Card Scheme
                            </div>

                                <div className="item2">
                                    <TextArea value={cardSchemes} growVertically={true} cols={80} onChange={(e) => handleGenericOnChange(null, e.target.value)} />
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
                                            options={terminals.map((value, index) => ({ value, id: index + 1 }))} />
                                    </div>
                                </div>

                            })

                        }
                    </div>

                </div>

                {
                    TERMINAL_LIST.map((terminal: string) => {
                        return <ItemGroup key={terminal} hidden={terminalHidden[terminal]} basic={isBasic} group={terminalSchema[terminal]} onChange={handleGenericOnChange} />
                    })
                }

                {
                    operations_schema.groups.filter(group => {
                        return group.name.toUpperCase() != 'VERSION' && group.name.toUpperCase() != 'MODES' && group.name.toUpperCase() != 'TERMINALS'; //Filtering since these are already displayed at the top
                    }).map(group => {
                        return <ItemGroup key={group.name} group={group} onChange={handleGenericOnChange} />
                    })
                }


            </div>


            <div className="button">

            </div>

        </div>

        <Footer />

    </>

};