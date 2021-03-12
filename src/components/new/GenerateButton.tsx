import React from 'react';
import { Button } from '@blueprintjs/core';
import XMLBuilder from 'xmlbuilder';
import FileSaver from 'file-saver';
import { ItemGroupType } from './ItemGroup';
import { ItemType } from './Item';

type ButtonProps = {
    intent: any,
    schema: any,
    object: any,
    text: string
}

export const GenerateButton = (props: ButtonProps) => {
    
    const handleOnSubmit = (e: any) => {
        e.preventDefault();

        const root = XMLBuilder.create('configuration');
        root.raw(''); //spacer

        props.schema.groups.map((group: ItemGroupType) => {

            root.com(group.name);

            group.items.map((i: ItemType) => {
                let item = root.ele('item');
                let objectValue = props.object[i.name];
                i.description ? item.commentBefore(i.description) : '';
                item.att('name', i.name);
                item.att('value', objectValue);
            });

            root.raw(''); //spacer

        });
        const xml = root.end({ pretty: true });
        console.log(xml);


        const blob = new Blob([xml], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "Configuration.xml");
    };


    return <Button intent={props.intent} onClick={handleOnSubmit} text={props.text} icon={"export"} large={true} />;
}