import React from 'react';
import { Footer } from '../Footer';
import { MultiSelectItem } from '../MultiSelectItem';
import { SelectItem } from '../SelectItem';
import { ItemTypesAll } from './Types';

const terminalList = ["FISERV", "SWIFTPASS", "MACAUPASS", "PSP_TERMINAL"];
const paymentTypeList = ["CREDITCARD", "VISA", "MASTERCARD", "ALIPAY", "WECHAT", "MPAY", "UQ", "BOCPAY"];

export const Configuration = () => {

    const [terminals, setTerminals] = React.useState(["FISERV", "SWIFTPASS"]);
    const [paymentTypes, setPaymentTypes] = React.useState(["CREDITCARD", "VISA", "MASTERCARD", "ALIPAY"]);

    const [paymentTypeTerminalMapping, setPaymentTypeTerminalMapping] = React.useState([{ paymentType: "", terminal: "" }]);   


    /** If selected terminals or payment types changes, update the mapping */
    React.useEffect(() => {

        setPaymentTypeTerminalMapping(current => {
            return paymentTypes.map(pt => {                 
                const curr = current.filter(curr => {
                    return curr.paymentType == pt;
                });
                if (curr && curr.length > 0) {
                    console.log('here', curr[0]);
                    return {...curr[0], terminal: (terminals.indexOf(curr[0].terminal) > -1 ? curr[0].terminal : "")};
                } else {
                    console.log('here new');
                    return {paymentType: pt, terminal: ""};
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
                    return {...curr, terminal: terminal};
                } else {
                    return {...curr};
                }
            });
        });
    });



    return <>

        <div className="wrapper">

            <h3 className="bp3-heading">Global FxChoice Configuration Manager</h3>

            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>

            <div className="content">

                <div className="contentRow">
                    <div className="label">
                        Select Terminal/s:
                    </div>

                    <div className="item2">
                        <MultiSelectItem values={terminals} options={terminalList} onSelect={handleTerminalChange} />
                    </div>
                </div>

                <div className="contentRow">
                    <div className="label">
                        Select Payment Type/s:
                    </div>

                    <div className="item2">
                        <MultiSelectItem values={paymentTypes} options={paymentTypeList} onSelect={handlePaymentTypeChange} />
                    </div>
                </div>

                {
                    paymentTypeTerminalMapping.map((m: { paymentType: string, terminal: string }) => {

                        return <div className="contentRow" key={m.paymentType}>
                            <div className="label">
                                {m.paymentType}:
                            </div>
                            <div className="item2">
                                <SelectItem onSelect={(id, val) => handlePaymentTerminalChange(m.paymentType, val)} value={m.terminal}
                                    options={terminals.map((value, index) => ({ value, id: index + 1 }))} />
                            </div>
                        </div>

                    })

                }

            </div>

            <div className="button">

            </div>

        </div>

        <Footer />

    </>

};