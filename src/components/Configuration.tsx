import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { ItemGroup, ItemGroupType } from './ItemGroup';
import { ItemType } from './Item';
import { GenerateButton } from './GenerateButton';
import df from 'd-forest';

type ConfigurationProps = {
    schema: ConfigType,
    type: string //All or Operations
}

export type ConfigType = {
    groups: ItemGroupType[]    
}

export const ConfigTypes = {
    ALL: "ALL",
    OPERATIONS: "OPERATIONS"
}

export const Configuration = (props: ConfigurationProps) => {

    const [schema, setSchema] = React.useState(props.schema);
    const [configType, setConfigType] = React.useState(props.type);

    const handleOnChange = (itemName: string, itemValue: string | string[]) => {

        setSchema((current: ConfigType) => {
            const item = df(current).findLeaf((leaf: ItemType) => leaf.name === itemName);
            item.value = itemValue;
            return { ...current };
        })
        
        
    }

    React.useEffect(() => {
        setSchema(props.schema); 
        setConfigType(props.type);
    }, [props.schema, props.type]);


    return <div className="wrapper">

        <h3 className="bp3-heading">Global FxChoice Configuration Manager</h3>

        
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        

        <div className="content">
            { schema && schema.groups &&
                schema.groups.filter((group: ItemGroupType) => {
                    return group.type.toUpperCase() === (configType === ConfigTypes.ALL ? group.type.toUpperCase() : configType);
                }).map((group: ItemGroupType) =>
                    <ItemGroup key={group.name} group={group} onChange={handleOnChange} />
                )
            }
        </div>

        <div className="button">
            <GenerateButton type={configType} intent={Intent.PRIMARY} object={schema} text="Generate" />
        </div>

    </div>

};