import * as React from 'react';
import { Configuration } from './Configuration';
import { NavigationBar } from './NavigationBar';
import { Footer } from './Footer';
import fs from 'fs';
import Path from 'path';
import xml2js from 'xml2js';

export const Home = () => {

    const configSchema = JSON.parse(fs.readFileSync(Path.join('resources\\schema.json'), 'utf8'));
    const [schema, setSchema] = React.useState(configSchema);
    
    const handleOnCreateNew = () => {
        console.log('Create New');
        setSchema(configSchema);
    }

    const handleOnFileImport = (filePath: string) => {

        const parser = new xml2js.Parser();
        fs.readFile(filePath, function (err, data) {
            parser.parseStringPromise(data)
            .then(function (result) {
                console.log("Contents: ", result);
            }).catch(function (err) {
                console.error("Error: ", err);
            });
        });
    }    

    return <>

        <NavigationBar onCreateNew={handleOnCreateNew} onImport={handleOnFileImport} />
        <Configuration schema={schema} />
        <Footer />

    </>
}