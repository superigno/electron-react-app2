import * as React from 'react';
import { Classes, ControlGroup, InputGroup, Label, Tooltip, Icon, NumericInput, Switch, TextArea } from '@blueprintjs/core';
import { SelectItem, OptionType } from './SelectItem';

type ItemProps = {
    item: ItemType,
    onChange: (value: string) => void;
}

export type ItemType = {
    order: number,
    name: string,
    type: string,
    description: string,
    size: number,
    value: string,
    options: string[]
}

export const Item = (props: ItemProps) => {

    const tooltipContent = props.item.description ? <span>{props.item.description}</span> : "";
    const typeLower: string = props.item.type ? props.item.type.toLowerCase() : 'text';

    const handleOnChange = (value: string) => {
        props.onChange(value);
    }

    let inputElement = <InputGroup value={props.item.value} size={props.item.size} onChange={(e) => handleOnChange(e.target.value)}/>;

    if (typeLower === 'number') {

        inputElement = <NumericInput value={props.item.value} large={false} size={props.item.size ? props.item.size : 1} onValueChange={(valueAsNum, valueAsString) => handleOnChange(valueAsString)} />;

    } else if (typeLower === 'boolean') {

        const isChecked = props.item.value && props.item.value == 'true' ? true : false;

        inputElement = <Switch checked={isChecked} onChange={(e) => handleOnChange(e.currentTarget.checked ? "true" : "false")} innerLabelChecked="On" innerLabel="Off" />;

    } else if (typeLower === 'select') {

        if (props.item.options) {
            const optionsList: OptionType[] = props.item.options.map((value, index) => ({ value, id: index + 1 }));
            inputElement = <SelectItem value={props.item.value} options={optionsList} onSelect={(id, value) => handleOnChange(value)}/>;
        } else {
            console.error(`\'options\' property for ${name} is undefined`);
        }       

    } else if (typeLower === 'largetext') {

        inputElement = <TextArea value={props.item.value} growVertically={true} onChange={(e) => handleOnChange(e.target.value)} />

    }    
    
    return <div className="item" style={{ paddingRight: '50px'}}>

            <div className="item">
                <Label className={Classes.INLINE} style={{ paddingRight: '20px' }}>
                    <span>{props.item.name}</span>
                    { tooltipContent && 
                    <Tooltip content={tooltipContent} minimal={true} >
                        <Icon icon="issue" iconSize={13} style={{ verticalAlign: 'top' }} />
                    </Tooltip>
                    }
                </Label>
            </div>

            <div className="item">
                {inputElement}
            </div>

        </div>
}