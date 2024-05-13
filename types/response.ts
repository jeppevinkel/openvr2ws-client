import {ResponseTypeEnum} from '../enums/responseTypeEnum';
import {ResponseKeyEnum} from '../enums/responseKeyEnum';

/**
 * The structure of a generic response from OpenVR2WS.
 */
export interface Response {
    Type: ResponseTypeEnum;
    Key: ResponseKeyEnum;
    Message: string;
    Data?: object;
    Nonce?: string;
}