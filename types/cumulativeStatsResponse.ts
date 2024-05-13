import {Response} from './response';
import {ResponseTypeEnum} from '../enums/responseTypeEnum';
import {ResponseKeyEnum} from '../enums/responseKeyEnum';

/**
 * The structure of a CumulativeStats response from OpenVR2WS.
 */
export interface CumulativeStatsResponse extends Response {
    Type: ResponseTypeEnum.Command;
    Key: ResponseKeyEnum.CumulativeStats;
    Data: {
        SystemTimeMs: number
        FramesPresented: number
        FramesDropped: number
        FramesReprojected: number
        FramesLoading: number
        FramesTimedOut: number
    };
}