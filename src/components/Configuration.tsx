import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { ItemGroup, ItemGroupType } from './ItemGroup';
import { ItemType } from './Item';
import { GenerateButton } from './GenerateButton';
import df from 'd-forest';

type ConfigurationProps = {
    schema: ConfigType,
    type: string //Tech or Operations
}

export type ConfigType = {
    groups: ItemGroupType[]    
}

export const Configuration = (props: ConfigurationProps) => {

    const [schema, setSchema] = React.useState(props.schema);

    const handleOnChange = (itemName: string, itemValue: string) => {

        setSchema((current: ConfigType) => {
            const item = df(current).findLeaf((leaf: ItemType) => leaf.name === itemName);
            item.value = itemValue;
            return { ...current };
        })
        
    }

    React.useEffect(() => {
        setSchema(props.schema);
    }, [props.schema]);


    return <div className="wrapper">

        <h3 className="bp3-heading">Global FxChoice Configuration Manager</h3>

        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>

        <div className="content">
            {
                schema.groups.filter((group: ItemGroupType) => {
                    return true;//group.type.toLowerCase() === props.type.toLowerCase();
                }).map((group: ItemGroupType) =>
                    <ItemGroup key={group.name} group={group} onChange={handleOnChange} />
                )
            }
        </div>

        <div className="button">
            <GenerateButton intent={Intent.PRIMARY} object={schema} text="Generate" />
        </div>

    </div>

};