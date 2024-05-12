import {Response} from './response';
import {ResponseTypeEnum} from '../enums/responseTypeEnum';
import {ResponseKeyEnum} from '../enums/responseKeyEnum';
import {Vec3} from './vec3';

/**
 * The structure of a PlayArea response from OpenVR2WS.
 */
export interface PlayAreaResponse extends Response {
    Type: ResponseTypeEnum.Command
    Key: ResponseKeyEnum.PlayArea
    Data: {
        Corners: Vec3[]
        Size: Vec3
    }
}