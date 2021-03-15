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

export default class SchemaFactory {

    static getTerminalSchema = (terminal: string): ItemGroupType => {
        if (terminal == AppConstants.TERMINALS.INGENICO_MOVE5000) {
            return INGENICO_MOVE5000;
        } else if (terminal == AppConstants.TERMINALS.DPAPOSA8) {
            return DPAPOSA8;
        } else if (terminal == AppConstants.TERMINALS.PAX_S60) {
            return PAX_S60;
        } else if (terminal == AppConstants.TERMINALS.PAX_A920) {
            return PAX_A920;
        } else if (terminal == AppConstants.TERMINALS.INGENICO_ICT250) {
            return INGENICO_ICT250;
        } else if (terminal == AppConstants.TERMINALS.TYROTTA) {
            return TYROTTA;
        } else if (terminal == AppConstants.TERMINALS.EPAY) {
            return EPAY;
        } else if (terminal == AppConstants.TERMINALS.EFTSOLUTIONS) {
            return EFTSOLUTIONS;
        } else if (terminal == AppConstants.TERMINALS.OCEANPAYMENT) {
            return OCEANPAYMENT;
        } else if (terminal == AppConstants.TERMINALS.UPLAN) {
            return UPLAN;
        } else if (terminal == AppConstants.TERMINALS.SWIFTPASS) {
            return SWIFTPASS;
        } else if (terminal == AppConstants.TERMINALS.MACAUPASS) {
            return MACAUPASS;
        } else if (terminal == AppConstants.TERMINALS.OCEANPAYMENT_CLIENT) {
            return OCEANPAYMENT_CLIENT;
        } else if (terminal == AppConstants.TERMINALS.FISERV) {
            return FISERV;
        } else if (terminal == AppConstants.TERMINALS.PSP_TERMINAL) {
            return PSP_TERMINAL;
        } else {
            return {} as ItemGroupType;
        }
    }

    static getOperationsSchema = (): {groups: ItemGroupType[]} => {
        //return new object as deep copy
        return JSON.parse(JSON.stringify(OPERATIONS));
    }

    static getAllTerminalSchemas = (): any => {
        const terminalSchemas: any = {};
        Object.values(AppConstants.TERMINALS).map((terminal: any) => {
            terminalSchemas[terminal] = SchemaFactory.getTerminalSchema(terminal);
        })
        //return new object as deep copy
        return JSON.parse(JSON.stringify(terminalSchemas));
    }
  
  }