import * as React from 'react';
import { ControlGroup } from '@blueprintjs/core';
import { Item, ItemType } from './Item';

type ItemGroupProps = {
    group: ItemGroupType,
    onChange: (id: string, value: string | string[]) => void;
}

export type ItemGroupType = {
    order: number,
    name: string,
    type: string,
    items: ItemType[]
}

export const ItemGroup = (props: ItemGroupProps) => {

    let items = props.group.items;

    //Sort by order number
    items.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)

    return <div className="item-group">

        <div>
            <h6 className="bp3-heading group-name">{props.group.name}</h6>
        </div>

        <div>
            {
                items.map((i: any) =>
                    <Item key={i.name}
                          item={i}                        
                          onChange={(val) => props.onChange(i.name, val)}
                    />
                )
            }
        </div>

    </div>

}