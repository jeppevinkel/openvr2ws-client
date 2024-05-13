import {Response} from './response';
import {ResponseTypeEnum} from '../enums/responseTypeEnum';
import {ResponseKeyEnum} from '../enums/responseKeyEnum';
import {Vec3} from './vec3';

/**
 * The structure of an ApplicationInfo response from OpenVR2WS.
 */
export interface ApplicationInfoResponse extends Response {
    AppId: string;
    SessionStart: number;
}