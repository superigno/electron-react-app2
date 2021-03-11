import * as React from 'react';
import { Item, ItemType } from './Item';

type ItemGroupProps = {
    group: ItemGroupType,
    onChange: (id: string, value: string | string[]) => void,
    hidden?: boolean,
    basic?: boolean
}

export type ItemGroupType = {
    order: number,
    name: string,
    id?: string,
    type: string,
    items: ItemType[]
}

export const ItemGroup = (props: ItemGroupProps) => {

    let items = props.group ? props.group.items : [];

    //Sort by order number
    if (items) {
        items.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)
    }

    return <>
        {!props.hidden && props.group &&
            <div className="item-group">

                <div>
                    <h6 className="bp3-heading group-name">{props.group.name}</h6>
                </div>

                <div>
                    {
                        items.filter(item => {
                            return props.basic ? item.basic == true : true;
                        }).map((i: any) =>
                            <Item key={i.name}
                                item={i}
                                onChange={(val) => props.onChange(i.name, val)}
                            />
                        )
                    }
                </div>

            </div>
        }
    </>

}