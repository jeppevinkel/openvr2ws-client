import {Response} from './response';
import {ResponseTypeEnum, ResponseKeyEnum} from '../enums';

/**
 * The structure of an ApplicationInfo response from OpenVR2WS.
 */
export interface ApplicationInfoResponse extends Response {
    Type: ResponseTypeEnum.Command
    Key: ResponseKeyEnum.ApplicationInfo
    Data: {
        AppId: string;
        SessionStart: number;
    }
}