import React from 'react';
import { Button } from '@blueprintjs/core';
import {FormItemGroupType} from './Configuration';
import XMLBuilder from 'xmlbuilder';
import FileSaver from 'file-saver';

type ButtonProps = {
    intent: any,
    object: FormItemGroupType[],
    text: string
}

export const GenerateButton = (props: ButtonProps) => {
    const {intent, object: formValues, text} = props;

    const handleOnSubmit = (e: any) => {
        e.preventDefault();

        const root = XMLBuilder.create('configuration');
        root.raw(''); //spacer
        
        formValues.map((obj: FormItemGroupType) => {

            root.com(obj.groupName);

            obj.items.map(i => {
                let item = root.ele('item');
                i.description ? item.commentBefore(i.description) : '';
                item.att('name', i.name);
                item.att('value', i.value);
            });

            root.raw(''); //spacer

        });
        const xml = root.end({ pretty: true });
        console.log(xml);


        const blob = new Blob([xml], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "Configuration.xml");
    };


    return <Button intent={intent} onClick={handleOnSubmit} text={text} />;
}