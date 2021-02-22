import * as React from 'react';
import { ControlGroup } from '@blueprintjs/core';
import { Item } from './Item';

type ItemType = {
    order: number,
    name: string,
    type: string,
    description: string,
    length: number,
    options: string[]
}

type ItemGroupProps = {
    groupName: string,
    items: ItemType[],
    onChange: (id: string, value: string) => void;
}

export const ItemGroup = (props: ItemGroupProps) => {

    const {groupName, items, onChange} = props;

    //Sort by order number
    items.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)

    return <div>

        <div>
            <u><h6 className="bp3-heading group-name">{groupName}</h6></u>
        </div>

        <ControlGroup fill={false} vertical={true}>
            {
                items.map((i: any) =>

                    <Item key={i.name}
                        name={i.name}
                        value={i.value}
                        description={i.description}
                        length={i.length}
                        type={i.type}
                        options={i.options}
                        onChange={(val) => onChange(i.name, val)}
                    />
                )
            }
        </ControlGroup>

    </div>

}