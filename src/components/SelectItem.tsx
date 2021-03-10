import * as React from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select, ItemPredicate, ItemRenderer } from "@blueprintjs/select";

export type OptionType = {
    id: number,
    value: string
}

type SelectProps = {
    value?: string,
    options: OptionType[],
    filterable?: boolean
    onSelect: (id:number, value:string) => void
}

const ItemSelect = Select.ofType<OptionType>();

export const SelectItem = (props: SelectProps) => {

    const [value, setValue] = React.useState(props.value);

    //Make value controlled
    React.useEffect(()=> {
        setValue(props.value);
    }, [props.value]);

    const handleValueChange = (item: OptionType) => {
        setValue(item.value);
        props.onSelect(item.id, item.value);
    };

    return (

        <ItemSelect
            filterable={props.filterable ? props.filterable : false}
            itemPredicate={itemPredicate} //will be used if filterable is true
            itemRenderer={itemRenderer} //the dropdown itself
            items={props.options}
            onItemSelect={handleValueChange}
            popoverProps={{ minimal: false }}
        >
            <Button
                rightIcon="caret-down"
                text={value ? value : "(No selection)"}
                disabled={false}
            />
        </ItemSelect>

    );

}

/** When filtering is enabled, this highlights the text while typing */
const highlightText = (text: string, query: string) => {
    let lastIndex = 0;
    const words = query
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(escapeRegExpChars);
    if (words.length === 0) {
        return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens: React.ReactNode[] = [];
    while (true) {
        const match = regexp.exec(text);
        if (!match) {
            break;
        }
        const length = match[0].length;
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
            tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
        tokens.push(rest);
    }
    return tokens;
};

const escapeRegExpChars = (text: string) => {
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

/** Used when filtering is enabled */
const itemPredicate: ItemPredicate<OptionType> = (query, item, _index, exactMatch) => {

    const normalizedTitle = item.value.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
        return normalizedTitle === normalizedQuery;
    } else {
        return `${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
};

/** The dropdown itself */
const itemRenderer: ItemRenderer<OptionType> = (item, { handleClick, modifiers, query }) => {

    if (!modifiers.matchesPredicate) {
        return null;
    }
    const text = `${item.value}`;
    return (
        <MenuItem
            key={item.id}    
            active={modifiers.active}
            disabled={modifiers.disabled}
            //label={item.value}
            onClick={handleClick}
            text={highlightText(text, query)} //highlight text when typing on filter
        />
    );
};