import React from 'react';
import { ConfigType, ConfigTypes } from './Configuration';
import { ItemGroup, ItemGroupType } from './ItemGroup';

type ContentProps = {
    schema: ConfigType,
    configType: string,
    onChange: (name: string, val: string) => void
}

export const Content = (props: ContentProps) => {

    React.useEffect(() => {
        console.log('Is Mounted');
        return () => {
            console.log('Is Unmounted');
        }
    });

    return <>
        {
            props.schema && props.schema.groups &&
            props.schema.groups.filter((group: ItemGroupType) => {
                return group.type.toUpperCase() === (props.configType === ConfigTypes.ALL ? group.type.toUpperCase() : props.configType);
            }).map((group: ItemGroupType) =>
                <ItemGroup key={group.name} group={group} onChange={props.onChange} />
            )
        }
    </>
}