import { TextArea } from '@blueprintjs/core';
import React from 'react';
import { MultiSelectItem } from './MultiSelectItem';
import AppConstants from './new/constant/AppConstants';
import { SelectItem } from './SelectItem';

const TERMINAL_LIST = Object.values(AppConstants.TERMINALS);
const PAYMENT_TYPE_LIST = Object.values(AppConstants.PAYMENT_TYPES);

type TerminalPaymentMappingProps = {
    onCardSchemeChange: (name: string, value: string) => void,
    onPaymentTypeChange: (items: string[]) => void,
    onTerminalChange: (items: string[]) => void,
    onPaymentTerminalChange: (paymentType: string, terminal: string) => void,
    isAdvanced: boolean,
    activeTerminals: any[],
    cardSchemes: string,
    paymentTypes: any[],
    paymentTypeTerminalMapping: { paymentType: string, terminal: string}[]
}

export const TerminalPaymentMapping = (props: TerminalPaymentMappingProps) => {

    //const [activeTerminals, setActiveTerminals] = React.useState([]);
    //const [cardSchemes, setCardSchemes] = React.useState();
    //const [paymentTypes, setPaymentTypes] = React.useState([]);
    //const [paymentTypeTerminalMapping, setPaymentTypeTerminalMapping] = React.useState([{ paymentType: "", terminal: "" }]);
    
    const handlePaymentTypeChange = (items: string[]) => {
        props.onPaymentTypeChange(items);
    }

    const handleTerminalChange = (items: string[]) => {
        props.onTerminalChange(items);
    }

    const handleCardSchemeChange = (name: string, value: string) => {
        props.onCardSchemeChange(name, value);
    }

    const handlePaymentTerminalChange = ((paymentType: string, terminal: string) => {
        props.onPaymentTerminalChange(paymentType, terminal);
    });

    return <div className="item-group">

        <div>
            <h6 className="bp3-heading group-name">Select Terminals and Assign to Payment Types</h6>
        </div>

        <div>
            <div className="contentRow">
                <div className="label">
                    Select Terminal/s
            </div>

                <div className="item2">
                    <MultiSelectItem values={props.activeTerminals} options={TERMINAL_LIST} onSelect={handleTerminalChange} />
                </div>
            </div>

            <div className="contentRow">
                <div className="label">
                    Select Payment Type/s
            </div>

                <div className="item2">
                    <MultiSelectItem values={props.paymentTypes} options={PAYMENT_TYPE_LIST} onSelect={handlePaymentTypeChange} />
                </div>
            </div>

            {props.isAdvanced &&
                <div className="contentRow">
                    <div className="label">
                        Terminal Card Scheme
            </div>

                    <div className="item2">
                        <TextArea defaultValue={props.cardSchemes} growVertically={true} cols={80} onChange={(e) => handleCardSchemeChange('TERMINAL_CARD_SCHEME', e.target.value)} />
                    </div>
                </div>
            }

            {
                props.paymentTypeTerminalMapping.map((m: { paymentType: string, terminal: string }) => {

                    return <div className="contentRow" key={m.paymentType}>
                        <div className="label">
                            {m.paymentType}
                        </div>
                        <div className="item2">
                            <SelectItem onSelect={(id, val) => handlePaymentTerminalChange(m.paymentType, val)} value={m.terminal}
                                options={props.activeTerminals.map((value: any, index: any) => ({ value, id: index + 1 }))} />
                        </div>
                    </div>

                })

            }
        </div>

    </div>
}