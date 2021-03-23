import * as React from 'react';
import { InputGroup, Tooltip, Icon, NumericInput, Switch, TextArea } from '@blueprintjs/core';
import { SelectItem, OptionType } from '../SelectItem';
import { MultiSelectItem } from '../MultiSelectItem';
import AppConstants from './constant/AppConstants';
import { ItemType } from './type/Types';

type ItemProps = {
    item: ItemType,
    onChange: (value: string | string[]) => void,
    advanced?: boolean
}

export const Item = (props: ItemProps) => {

    const tooltipContent = props.item.description ? <span>{props.item.description}</span> : "";
    const typeUpper: string = props.item.type ? props.item.type.toUpperCase() : AppConstants.ITEM_TYPES.TEXT;
    const showAdvanced = props.advanced ? true : !props.item.advanced; //if advanced mode is toggled, show all basically, else show only those advanced == false

    const handleOnChange = (value: string | string[]) => {
        props.onChange(value);
    }

    let inputElement = <InputGroup defaultValue={props.item.value as string} size={props.item.size ? props.item.size : props.item.value ? props.item.value.toLocaleString().length + 3 : 10} onChange={(e) => handleOnChange(e.target.value)} />;

    if (typeUpper === AppConstants.ITEM_TYPES.NUMBER) {

        inputElement = <NumericInput defaultValue={props.item.value as number} large={false} size={props.item.size ? props.item.size : 1} onValueChange={(valueAsNum, valueAsString) => handleOnChange(valueAsString)} />;

    } else if (typeUpper === AppConstants.ITEM_TYPES.BOOLEAN) {

        const isChecked = props.item.value ? true : false;

        inputElement = <Switch defaultChecked={isChecked} onChange={(e) => handleOnChange(e.currentTarget.checked ? "true" : "false")} innerLabelChecked="On" innerLabel="Off" />;

    } else if (typeUpper === AppConstants.ITEM_TYPES.SELECT) {

        if (props.item.options) {
            const optionsList: OptionType[] = props.item.options.map((value, index) => ({ value, id: index + 1 }));
            inputElement = <SelectItem value={(props.item.value as string)} options={optionsList} onSelect={(id, value) => handleOnChange(value)} />;
        } else {
            console.error(`\'options\' property for ${name} is undefined`);
        }

    } else if (typeUpper === AppConstants.ITEM_TYPES.LARGETEXT) {

        inputElement = <TextArea defaultValue={(props.item.value as string)} growVertically={true} cols={props.item.size ? props.item.size : 40} onChange={(e) => handleOnChange(e.target.value)} />

    } else if (typeUpper === AppConstants.ITEM_TYPES.MULTISELECT) {
        inputElement = <MultiSelectItem values={(props.item.value as string[])} options={props.item.options} onSelect={handleOnChange} />
    }

    return <>
    { showAdvanced &&
        <div className="contentRow">

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
    </>
}