import React from "react";
import { Button, Intent, MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, MultiSelect } from "@blueprintjs/select";

type SelectProps = {
    values: string[],
    options: string[],
    onSelect: (items: string[]) => void
}

const ItemMultiSelect = MultiSelect.ofType<string>();

export const MultiSelectItem = (props: SelectProps) => {

    const [selectedItems, setSelectedItems] = React.useState(props.values);
    
    const renderTag = (item: string) => item;

    const renderItem: ItemRenderer<string> = (item, { modifiers, handleClick }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                icon={isItemSelected(item) ? "tick" : "blank"}
                key={item}
                //label={item.value}
                onClick={handleClick}
                text={item}
                shouldDismissPopover={false}
            />
        );
    };

    const filterItem: ItemPredicate<string> = (query, item, _index, exactMatch) => {
        const normalizedTitle = item.toLowerCase();
        const normalizedQuery = query.toLowerCase();
    
        if (exactMatch) {
            return normalizedTitle === normalizedQuery;
        } else {
            return `${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
        }
    };

    const handleTagRemove = (_tag: React.ReactNode, index: number) => {
        deselectItem(index);
    };

    const getSelectedItemIndex = (item: string) => {
        return selectedItems.indexOf(item);
    }

    const isItemSelected = (item: string) => {
        return getSelectedItemIndex(item) !== -1;
    }

    const selectItem = (item: string) => (
        selectItems([item])
    );

    const arrayContainsItem = (items: string[], itemToFind: string): boolean => {
        return items.some((item) => item === itemToFind);
    }

    const selectItems = (itemsToSelect: string[]) => {        
        let currentSelectedItems = selectedItems.slice();
        itemsToSelect.forEach(item => {
            currentSelectedItems = !arrayContainsItem(currentSelectedItems, item) ? [...currentSelectedItems, item] : currentSelectedItems;
        });
        setSelectedItems(currentItems => {                 
            props.onSelect(currentSelectedItems);
            return currentSelectedItems;
        });   
    }

    const deselectItem = (index: number) => (        
        setSelectedItems(currentItems => {
            const filteredItems = selectedItems.filter((_item, i) => i !== index);
            props.onSelect(filteredItems);
            return filteredItems;

        })
    )

    const handleItemSelect = (item: string) => {
        if (!isItemSelected(item)) {
            selectItem(item);
        } else {
            deselectItem(getSelectedItemIndex(item));
        }        
    };

    const handleItemsPaste = (items: string[]) => {
        // On paste, don't bother with deselecting already selected values, just
        // add the new ones.
        selectItems(items);
    };

    const areItemsEqual = (itemA: string, itemB: string) => {
        //ignoring case just for simplicity
        return itemA.toLowerCase() === itemB.toLowerCase();
    }

    const handleClear = () => setSelectedItems([]);


    const clearButton = props.options.length > 0 ? <Button icon="cross" minimal={true} onClick={handleClear} /> : undefined;

        return (
                <ItemMultiSelect
                    resetOnSelect = {true}   //if you type in the field it will select the item and remove what you typed
                    itemPredicate={filterItem} //used when typing the text to filter items
                    itemRenderer={renderItem} //the dropdown iteself
                    itemsEqual={areItemsEqual} //to avoid duplicates if items are equal
                    items={props.options}
                    noResults={<MenuItem disabled={true} text="No results." />} //if you type and there are no matches
                    onItemSelect={handleItemSelect}
                    onItemsPaste={handleItemsPaste}
                    popoverProps={{ minimal: true }}

                    tagRenderer={renderTag} //what will display in the field once item is selected
                    tagInputProps={{ //properties of selected items in the field
                        onRemove: handleTagRemove,
                        rightElement: clearButton,
                        tagProps: {minimal: true, intent: Intent.NONE},
                    }}

                    selectedItems={selectedItems}
                />
            
        );            

}

