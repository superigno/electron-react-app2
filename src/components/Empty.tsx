import React from 'react';
import { Icon, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export const Empty = () => {

    return <>

        <div className="bp3-non-ideal-state">
            <div className="bp3-non-ideal-state-visual">
                <Icon icon={IconNames.FOLDER_OPEN} iconSize={50} />
            </div>
            <h4 className="bp3-heading">This folder is empty</h4>
            <div>Create a new file to populate the folder.</div>
            <button className="bp3-button bp3-intent-primary">Create</button>
        </div>

    </>
}