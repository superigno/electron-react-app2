import * as React from 'react';
import { Classes, ControlGroup, InputGroup, Label, Tooltip, Icon, NumericInput, Switch, TextArea } from '@blueprintjs/core';
import { SelectItem, OptionType } from './SelectItem';

type ItemProps = {
    name: string,
    value?: string,
    type?: string,
    description: string,
    length?: number,
    options?: string[]
    onChange: (value: string) => void;
}

export const Item = (props: ItemProps) => {

    const {name, value, description, type, length, options, onChange} = props;
    const tooltipContent = description ? <span>{description}</span> : "";
    const typeLower: string = type ? type.toLowerCase() : 'text';

    const handleOnChange = (value: string) => {
        onChange(value);
    }

    let inputElement = <InputGroup value={value} size={length} onChange={(e) => handleOnChange(e.target.value)}/>;

    if (typeLower === 'number') {

        inputElement = <NumericInput value={value} large={false} size={length} onValueChange={(valueAsNum, valueAsString) => handleOnChange(valueAsString)} />;

    } else if (typeLower === 'boolean') {

        inputElement = <Switch value={value} onChange={(e) => handleOnChange(e.currentTarget.checked ? "true" : "false")} innerLabelChecked="On" innerLabel="Off" />;

    } else if (typeLower === 'select') {

        if (options) {
            const optionsList: OptionType[] = options.map((value, index) => ({ value, id: index + 1 }));
            inputElement = <SelectItem value={value} options={optionsList} onSelect={(id, value) => handleOnChange(value)}/>;
        } else {
            console.error(`\'options\' property for ${name} is undefined`);
        }       

    } else if (typeLower === 'largetext') {

        inputElement = <TextArea value={value} growVertically={true} onChange={(e) => handleOnChange(e.target.value)} />

    }    
    
    return <div>

        <ControlGroup>
            <div style={{ width: '50%' }}>
                <Label className={Classes.INLINE} style={{ paddingRight: '20px' }}>
                    <span>{name}</span>
                    { tooltipContent && 
                    <Tooltip content={tooltipContent} minimal={true} >
                        <Icon icon="issue" iconSize={13} style={{ verticalAlign: 'top' }} />
                    </Tooltip>
                    }
                </Label>
            </div>

            <div>
                {inputElement}
            </div>

        </ControlGroup>

    </div>
}