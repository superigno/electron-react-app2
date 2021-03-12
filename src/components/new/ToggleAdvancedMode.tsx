import { Icon, Switch, Tooltip } from '@blueprintjs/core';
import React from 'react';

type ToggleProps = {
    checked: boolean,
    onChange: (e: any) => void
}

export const ToggleAdvancedMode = (props: ToggleProps) => {

    const [checked, setChecked] = React.useState(props.checked);

    React.useEffect(()=> {
        setChecked(props.checked);
    }, [props.checked])

    return <div>
        <div style={{ display: 'inline-block' }}>
            <Tooltip content={"Toggle to view advanced configurations"} minimal={true} >
                <Icon icon="issue" iconSize={13} style={{ verticalAlign: 'top' }} />
            </Tooltip>
                        &nbsp;Advanced Mode&nbsp;
                    </div>
        <div style={{ display: 'inline-block' }}>
            <Switch checked={checked} onChange={props.onChange} innerLabelChecked="On" innerLabel="Off" />
        </div>
    </div>
}