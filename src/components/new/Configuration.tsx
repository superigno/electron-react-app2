import React from 'react';
import { Footer } from '../Footer';
import { MultiSelectItem } from '../MultiSelectItem';
import { SelectItem } from '../SelectItem';
import { ItemGroup } from './ItemGroup';
import ingenico_move5000 from '../../../resources/ingenico_move5000.json';
import dpaposa8 from '../../../resources/dpaposa8.json';
import { Icon, Switch, Tooltip } from '@blueprintjs/core';

const terminalList = ["FISERV", "SWIFTPASS", "MACAUPASS", "PSP_TERMINAL", "INGENICO_MOVE5000", "DPAPOSA8"];
const paymentTypeList = ["CREDITCARD", "VISA", "MASTERCARD", "ALIPAY", "WECHAT", "MPAY", "UQ", "BOCPAY"];

export const Configuration = () => {

    const [terminals, setTerminals] = React.useState(["FISERV", "SWIFTPASS"]);
    const [paymentTypes, setPaymentTypes] = React.useState(["CREDITCARD", "VISA", "MASTERCARD", "ALIPAY"]);
    const [paymentTypeTerminalMapping, setPaymentTypeTerminalMapping] = React.useState([{ paymentType: "", terminal: "" }]);

    const [hideIngenico, setHideIngenico] = React.useState(true);
    const [hideDpaposa8, setHideDpaposa8] = React.useState(true);
    const [isBasic, setIsBasic] = React.useState(true);

    /** Hide respective sections when terminals change */
    React.useEffect(() => {
        setHideIngenico(terminals.indexOf("INGENICO_MOVE5000") == -1);
        setHideDpaposa8(terminals.indexOf("DPAPOSA8") == -1);
    }, [terminals]);

    /** If selected terminals or payment types changes, update the mapping */
    React.useEffect(() => {
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
                        <Tooltip content={"Toggle to view basic configuration"} minimal={true} >
                            <Icon icon="issue" iconSize={13} style={{ verticalAlign: 'top' }} />
                        </Tooltip>
                        &nbsp;Toggle Basic Mode&nbsp;
                    </div>
                    <div style={{ display: 'inline-block' }}>
                        <Switch checked={isBasic} onChange={handleToggleBasic} innerLabelChecked="On" innerLabel="Off" />
                    </div>
                </div>


                <div className="item-group">

                    <div>
                        <h6 className="bp3-heading group-name">Select Terminals and Map to Payment Types</h6>
                    </div>

                    <div>
                        <div className="contentRow">
                            <div className="label">
                                Select Terminal/s
                            </div>

                            <div className="item2">
                                <MultiSelectItem values={terminals} options={terminalList} onSelect={handleTerminalChange} />
                            </div>
                        </div>

                        <div className="contentRow">
                            <div className="label">
                                Select Payment Type/s
                            </div>

                            <div className="item2">
                                <MultiSelectItem values={paymentTypes} options={paymentTypeList} onSelect={handlePaymentTypeChange} />
                            </div>
                        </div>

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


                <ItemGroup hidden={hideIngenico} basic={isBasic} group={ingenico_move5000} onChange={handleGenericOnChange} />
                <ItemGroup hidden={hideDpaposa8} basic={isBasic} group={dpaposa8} onChange={handleGenericOnChange} />


            </div>


            <div className="button">

            </div>

        </div>

        <Footer />

    </>

};