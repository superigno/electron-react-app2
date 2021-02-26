import * as React from 'react';
import { ControlGroup } from '@blueprintjs/core';
import { Item, ItemType } from './Item';

type ItemGroupProps = {
    group: ItemGroupType,
    onChange: (id: string, value: string) => void;
}

export type ItemGroupType = {
    order: number,
    name: string,
    items: ItemType[]
}

export const ItemGroup = (props: ItemGroupProps) => {

    //Sort by order number
    props.group.items.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)

    return <div>

        <div>
            <u><h6 className="bp3-heading group-name">{props.group.name}</h6></u>
        </div>

        <ControlGroup fill={false} vertical={true}>
            {
                props.group.items.map((i: any) =>

                    <Item key={i.name}
                          item={i}                        
                          onChange={(val) => props.onChange(i.name, val)}
                    />
                )
            }
        </ControlGroup>

    </div>

}