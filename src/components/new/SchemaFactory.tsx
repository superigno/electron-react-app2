import AppConstants from './constant/AppConstants';
import { ItemGroupType } from './ItemGroup';
import INGENICO_MOVE5000 from '../../../resources/schemas/terminal/INGENICO_MOVE5000.json';
import DPAPOSA8 from '../../../resources/schemas/terminal/DPAPOSA8.json';
import PAX_S60 from '../../../resources/schemas/terminal/PAX_S60.json';
import PAX_A920 from '../../../resources/schemas/terminal/PAX_A920.json';
import INGENICO_ICT250 from '../../../resources/schemas/terminal/INGENICO_ICT250.json';
import TYROTTA from '../../../resources/schemas/terminal/TYROTTA.json';
import EPAY from '../../../resources/schemas/terminal/EPAY.json';
import EFTSOLUTIONS from '../../../resources/schemas/terminal/EFTSOLUTIONS.json';
import OCEANPAYMENT from '../../../resources/schemas/terminal/OCEANPAYMENT.json';
import UPLAN from '../../../resources/schemas/terminal/UPLAN.json';
import SWIFTPASS from '../../../resources/schemas/terminal/SWIFTPASS.json';
import MACAUPASS from '../../../resources/schemas/terminal/MACAUPASS.json';
import OCEANPAYMENT_CLIENT from '../../../resources/schemas/terminal/OCEANPAYMENT_CLIENT.json';
import FISERV from '../../../resources/schemas/terminal/FISERV.json';
import PSP_TERMINAL from '../../../resources/schemas/terminal/PSP_TERMINAL.json';
import OPERATIONS from '../../../resources/schemas/operations_schema.json';
import { SchemaType } from './Configuration';

export default class SchemaFactory {
    
    static getTerminalSchema = (terminal: string): SchemaType => {
        let terminalSchema = {} as SchemaType;
        if (terminal == AppConstants.TERMINALS.INGENICO_MOVE5000) {
            terminalSchema = INGENICO_MOVE5000;
        } else if (terminal == AppConstants.TERMINALS.DPAPOSA8) {
            terminalSchema = DPAPOSA8;
        } else if (terminal == AppConstants.TERMINALS.PAX_S60) {
            terminalSchema = PAX_S60;
        } else if (terminal == AppConstants.TERMINALS.PAX_A920) {
            terminalSchema = PAX_A920;
        } else if (terminal == AppConstants.TERMINALS.INGENICO_ICT250) {
            terminalSchema = INGENICO_ICT250;
        } else if (terminal == AppConstants.TERMINALS.TYROTTA) {
            terminalSchema = TYROTTA;
        } else if (terminal == AppConstants.TERMINALS.EPAY) {
            terminalSchema = EPAY;
        } else if (terminal == AppConstants.TERMINALS.EFTSOLUTIONS) {
            terminalSchema = EFTSOLUTIONS;
        } else if (terminal == AppConstants.TERMINALS.OCEANPAYMENT) {
            terminalSchema = OCEANPAYMENT;
        } else if (terminal == AppConstants.TERMINALS.UPLAN) {
            terminalSchema = UPLAN;
        } else if (terminal == AppConstants.TERMINALS.SWIFTPASS) {
            terminalSchema = SWIFTPASS;
        } else if (terminal == AppConstants.TERMINALS.MACAUPASS) {
            terminalSchema = MACAUPASS;
        } else if (terminal == AppConstants.TERMINALS.OCEANPAYMENT_CLIENT) {
            terminalSchema = OCEANPAYMENT_CLIENT;
        } else if (terminal == AppConstants.TERMINALS.FISERV) {
            terminalSchema = FISERV;
        } else if (terminal == AppConstants.TERMINALS.PSP_TERMINAL) {
            terminalSchema = PSP_TERMINAL;
        }     
        return SchemaFactory.makeImmutable(terminalSchema);
    }

    static getOperationsSchema = (): SchemaType => {
        return SchemaFactory.makeImmutable(OPERATIONS);
    }

    //Return immutable object
    static getAllTerminalSchemas = (): {} => {
        const terminalSchemas: any = {};
        Object.values(AppConstants.TERMINALS).map((terminal: string) => {
            terminalSchemas[terminal] = SchemaFactory.getTerminalSchema(terminal);
        });        
        return Object.freeze(terminalSchemas);
    }

    private static makeImmutable = (schema: SchemaType) => {
        const groupsArr = schema.groups.map((group: ItemGroupType) => {
            const itemsArr = group.items.map(item => {
                return Object.freeze(item);
            });
            return Object.freeze({ ...group, items: itemsArr });
        });
        return Object.freeze({ groups: groupsArr });
    }

}