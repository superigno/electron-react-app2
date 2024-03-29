import * as React from 'react';
import { Item } from './Item';
import { ItemGroupType, ItemType } from './type/Types';

type ItemGroupProps = {
    group: ItemGroupType,
    onChange: (id: string, value: string | string[]) => void,
    hidden?: boolean,
    advanced?: boolean
}

export const ItemGroup = (props: ItemGroupProps) => {

    const group: ItemGroupType = props.group ? props.group : {} as ItemGroupType;
    const items = group.items ? group.items : [];
    const showAdvanced = props.advanced ? true : !group.advanced; //if advanced mode is toggled, show all basically, else show only those advanced == false
    const isHidden = props.hidden ? props.hidden : group.hidden ? group.hidden : false;

    //Sort by order number
    items.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)
    
    return <>
        {!isHidden && items && showAdvanced &&
            <div className="item-group">

                <div>
                    <h5 className="bp3-heading group-name">{group.name}</h5>
                </div>

                <div>
                    {
                        items.map((i: any) =>
                            <Item key={i.name}
                                item={i}
                                onChange={(val) => props.onChange(i.name, val)} advanced={props.advanced}
                            />
                        )
                    }
                </div>

            </div>
        }
    </>

}