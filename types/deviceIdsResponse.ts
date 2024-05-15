import {Response} from './response';
import {ResponseTypeEnum, ResponseKeyEnum, InputSourceEnum, TrackedDeviceClassEnum} from '../enums';

/**
 * The structure of an ApplicationInfo response from OpenVR2WS.
 */
export interface DeviceIdsResponse extends Response {
    Type: ResponseTypeEnum.Command
    Key: ResponseKeyEnum.DeviceIds
    Data: {
        DeviceToIndex: Map<TrackedDeviceClassEnum, Set<number>>;
        SourceToIndex: Map<InputSourceEnum, number>;
    }
}

