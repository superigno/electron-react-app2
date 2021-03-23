import { TextArea } from '@blueprintjs/core';
import React from 'react';
import { MultiSelectItem } from '../MultiSelectItem';
import AppConstants from './constant/AppConstants';
import { SelectItem } from '../SelectItem';
import df from 'd-forest';
import { ItemGroup } from './ItemGroup';
import { SchemaType } from './Configuration';
import { Item } from './Item';

const TERMINAL_LIST = Object.values(AppConstants.TERMINALS);
const PAYMENT_TYPE_LIST = Object.values(AppConstants.PAYMENT_TYPES);

type TerminalPaymentMappingProps = {
    operationsSchema: SchemaType,
    terminalSchemas: {[key:string]: SchemaType},
    isAdvancedMode: boolean,
    toggleReload: boolean,
    onChange: (name: string, value: string | string[]) => void
    onActiveTerminalsChange: (activeTerminals: string[]) => void
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

const isTerminalHidden = (terminal: string, activeTerminals: string[]) => {
    return activeTerminals.indexOf(terminal) == -1;
}

export const TerminalPaymentMapping = (props: TerminalPaymentMappingProps) => {

    const [activeTerminals, setActiveTerminals] = React.useState([]);
    const [terminalHidden, setTerminalHidden] = React.useState({} as any);

    const [cardSchemes, setCardSchemes] = React.useState();
    const [paymentTypes, setPaymentTypes] = React.useState([]);
    const [paymentTypeTerminalMapping, setPaymentTypeTerminalMapping] = React.useState([{ paymentType: "", terminal: "" }]);

    const initActiveTerminalsList = () => {
        setActiveTerminals(df(props.operationsSchema).findLeaf((leaf: any) => leaf.name === 'TERMINAL_NAME').value);
    }

    const initCardSchemesList = () => {
        setCardSchemes(df(props.operationsSchema).findLeaf((leaf: any) => leaf.name === 'TERMINAL_CARD_SCHEME').value);
    }

    const initPaymentTypesAndTerminalMapping = () => {
        const paymentScheme = df(props.operationsSchema).findLeaf((leaf: any) => leaf.name === 'TERMINAL_PAYMENT_SCHEME');
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
        initActiveTerminalsList();
        initCardSchemesList();
        initPaymentTypesAndTerminalMapping();
    }, [props.toggleReload]);

    /** Hide respective terminals when selected terminals change */
    React.useEffect(() => {
        setTerminalHidden((current: any) => {
            TERMINAL_LIST.map((terminal) => {
                current[terminal] = isTerminalHidden(terminal, activeTerminals);
            })
            return { ...current };
        });
        props.onActiveTerminalsChange(activeTerminals);
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

    const handlePaymentTypeChange = (items: string[]) => {
        setPaymentTypes(items);
    }

    const handleTerminalChange = (items: string[]) => {
        setActiveTerminals(items);
        props.onChange("TERMINAL_NAME", items);
    }

    const handleCardSchemeChange = (val: string) => {
        props.onChange('TERMINAL_CARD_SCHEME', val);
    }

    /** Fill 'TERMINAL_PAYMENT_SCHEME' form value on init or payment type/terminal mapping change */
    React.useEffect(() => {
        const ptArr: string[] = [];
        paymentTypeTerminalMapping.map(pt => {
            if (pt.terminal) {
                ptArr.push(`${pt.paymentType}:${pt.terminal}`);
            }
        })
        props.onChange("TERMINAL_PAYMENT_SCHEME", ptArr);
    }, [paymentTypeTerminalMapping]);

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

    return <><div className="item-group">

        <div>
            <h5 className="bp3-heading group-name">Select Terminals and Assign to Payment Types</h5>
        </div>

        <div>

            <Item item={{order: 1, name: 'Select Terminal/s', type: AppConstants.ITEM_TYPES.MULTISELECT, value: activeTerminals, options: TERMINAL_LIST}} 
                onChange={handleTerminalChange} />

            <Item item={{order: 2, name: 'Select Payment Type/s', type: AppConstants.ITEM_TYPES.MULTISELECT, value: paymentTypes, options: PAYMENT_TYPE_LIST}} 
                onChange={handlePaymentTypeChange} />

            <Item item={{order: 3, name: 'Terminal Card Scheme', type: AppConstants.ITEM_TYPES.LARGETEXT, value: cardSchemes, size: 80, advanced: true}}
                onChange={handleCardSchemeChange} advanced={props.isAdvancedMode} />    

            {
                paymentTypeTerminalMapping.map((m: { paymentType: string, terminal: string }, index) => {
                    return <Item item={{order: index, name: m.paymentType, type: AppConstants.ITEM_TYPES.SELECT, value: m.terminal, options: activeTerminals}} 
                            key={m.paymentType} onChange={(val: string) => handlePaymentTerminalChange(m.paymentType, val)} /> 
                })
            }
            
        </div>

    </div>

        {
            TERMINAL_LIST.map((terminal: string) => {
                return <ItemGroup key={terminal} hidden={terminalHidden[terminal]} advanced={props.isAdvancedMode} group={props.terminalSchemas[terminal].groups[0]} onChange={props.onChange} />
        
            })
        }

    </>
}