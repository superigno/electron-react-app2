import * as React from 'react';
import { Classes, InputGroup, Label, Tooltip, Icon, NumericInput, Switch, TextArea } from '@blueprintjs/core';
import { SelectItem, OptionType } from '../SelectItem';
import { MultiSelectItem } from '../MultiSelectItem';

type ItemProps = {
    item: ItemType,
    onChange: (value: string | string[]) => void;
}

export type ItemType = {
    order: number,
    name: string,
    type: string,
    description?: string,
    size?: number,
    value?: string | number | boolean | string[],
    options?: string[],
    basic?: boolean
}

export const Item = (props: ItemProps) => {

    const tooltipContent = props.item.description ? <span>{props.item.description}</span> : "";
    const typeLower: string = props.item.type ? props.item.type.toLowerCase() : 'text';

    const handleOnChange = (value: string | string[]) => {
        props.onChange(value);
    }

    let inputElement = <InputGroup key={props.item.name} defaultValue={props.item.value as string} size={props.item.size ? props.item.size : props.item.value ? props.item.value.toLocaleString().length + 2 : 10} onChange={(e) => handleOnChange(e.target.value)} />;

    if (typeLower === 'number') {

        inputElement = <NumericInput key={props.item.name} defaultValue={props.item.value as string} large={false} size={props.item.size ? props.item.size : 1} onValueChange={(valueAsNum, valueAsString) => handleOnChange(valueAsString)} />;

    } else if (typeLower === 'boolean') {

        const isChecked = props.item.value && (props.item.value as string) == 'true' ? true : false;

        inputElement = <Switch key={props.item.name} defaultChecked={isChecked} onChange={(e) => handleOnChange(e.currentTarget.checked ? "true" : "false")} innerLabelChecked="On" innerLabel="Off" />;

    } else if (typeLower === 'select') {

        if (props.item.options) {
            const optionsList: OptionType[] = props.item.options.map((value, index) => ({ value, id: index + 1 }));
            inputElement = <SelectItem key={props.item.name} value={(props.item.value as string)} options={optionsList} onSelect={(id, value) => handleOnChange(value)} />;
        } else {
            console.error(`\'options\' property for ${name} is undefined`);
        }

    } else if (typeLower === 'largetext') {

        inputElement = <TextArea key={props.item.name} defaultValue={(props.item.value as string)} growVertically={true} cols={props.item.size ? props.item.size : 40} onChange={(e) => handleOnChange(e.target.value)} />

    } else if (typeLower === 'multiselect') {
        inputElement = <MultiSelectItem key={props.item.name} values={(props.item.value as string[])} options={props.item.options} onSelect={handleOnChange} />
    }

    return <div className="contentRow">

        <div className="label">
            {tooltipContent &&
                <Tooltip content={tooltipContent} minimal={true} >
                    <Icon icon="issue" iconSize={13} style={{ verticalAlign: 'top' }} />
                </Tooltip>
            }&nbsp;{props.item.name}
        </div>

        <div className="item2">
            {inputElement}
        </div>
    </div>

}