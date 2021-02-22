import React from 'react';
import fs from 'fs';
import Path from 'path';
import { Button, Colors, Intent } from '@blueprintjs/core';
import { NavigationBar } from './NavigationBar';
import { ItemGroup } from './ItemGroup';
import XMLBuilder from 'xmlbuilder';
import FileSaver from 'file-saver';

type ItemType = {
    name: string,
    value: string
}

export const Configuration = () => {

    const [formValues, setFormValues] = React.useState([]);
    const schema = JSON.parse(fs.readFileSync(Path.join('resources\\schema.json'), 'utf8'));

    //Sort by order number
    schema.groups.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)
    console.log(schema.groups);

    const handleOnSubmit = (e: any) => {
        e.preventDefault();

        const root = XMLBuilder.create('configuration');
        //root.com('This is a comment');
        formValues.map(obj => {
            let item = root.ele('item');
            item.att('name', obj.name);
            item.att('value', obj.value);
        });

        const xml = root.end({ pretty: true });
        console.log("XML: ", xml);


        const blob = new Blob([xml], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "Configuration.xml");
    };

    const handleOnChange = (itemName: string, itemValue: string) => {

        setFormValues(currentValues => {
            const item: ItemType = currentValues.find((p) => {
                return p.name === itemName;
            });
            item.value = itemValue;
            return currentValues;
        });

        console.log('On Change ID:', itemName);
        console.log('On Change Value:', itemValue);
        console.log('Values:', formValues);
    }

    //Initialize
    React.useEffect(() => {

        const items: ItemType[] = [];
        schema.groups.map((group: any) =>
            group.items.map((i: any) =>
                items.push({
                    name: i.name,
                    value: i.value ? i.value : ""
                })
            )
        );

        setFormValues(items);
    }, []);


    return <>

        <NavigationBar />

        <div className="wrapper">

            <h3 className="bp3-heading">Global FxChoice Configuration Manager</h3>

            <div style={{ paddingBottom: '20px' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>

            <div className="content">

                <div>
                    {
                        schema.groups.map((group: any) =>
                            <ItemGroup key={group.name} groupName={group.name} items={group.items} onChange={handleOnChange} />
                        )
                    }
                </div>

            </div>

            <div className="button">
                <Button intent={Intent.PRIMARY} onClick={handleOnSubmit} text="Generate Configuration File" />
            </div>

        </div>

        <div className="footer" style={{ color: Colors.WHITE, backgroundColor: Colors.BLUE2 }}>Copyright © 2021 Pure Commerce. All rights reserved.</div>

    </>

};