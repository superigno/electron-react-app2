import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { ItemGroup } from './ItemGroup';
import { GenerateButton } from './GenerateButton';
import df from 'd-forest';

type FormItemType = {
    name: string,
    value: string,
    description?: string
}

type ConfigurationProps = {
    schema: any
}

export type FormItemGroupType = {
    groupName: string,
    items: FormItemType[]
}

export const Configuration = (props: ConfigurationProps) => {

    const [formObjects, setFormObjects] = React.useState([]);
    const [schema, setSchema] = React.useState(props.schema);
    //const schema = props.schema;

    //Sort by order number
    schema.groups.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)
    
    console.log('Schema: ', schema);

    const handleOnChange = (itemName: string, itemValue: string) => {

        setFormObjects(current => {
            const item = df(current).findLeaf((leaf: any) => leaf.name === itemName);
            item.value = itemValue;
            return current;
        });

        console.log('On Change ID:', itemName);
        console.log('On Change Value:', itemValue);
        console.log('Form Objects:', formObjects);
    }

    //Initialize form objects
    React.useEffect(() => {

        console.log('Use Effect');
        
        const itemsGroup: FormItemGroupType[] = [];
        schema.groups.map((group: any) => {

            console.log("Here");
            const items: FormItemGroupType = { groupName: "", items: [] };

            items.groupName = group.name;

            group.items.map((i: any) =>
                items.items.push({
                    name: i.name,
                    value: i.value ? i.value : "",
                    description: i.description
                })
            )

            itemsGroup.push(items);

        });

        setFormObjects(itemsGroup);
        console.log('Items: ', itemsGroup);

    }, []);


    return <div className="wrapper">

        <h3 className="bp3-heading">Global FxChoice Configuration Manager</h3>

        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>

        <div className="content">
            {
                schema.groups.map((group: any) =>
                    <ItemGroup key={group.name} groupName={group.name} items={group.items} onChange={handleOnChange} />
                )
            }
        </div>

        <div className="button">
            <GenerateButton intent={Intent.PRIMARY} object={formObjects} text="Generate Configuration File" />
        </div>

    </div>

};