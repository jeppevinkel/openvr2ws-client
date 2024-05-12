import {ResponseTypeEnum} from '../enums/responseTypeEnum';
import {ResponseKeyEnum} from '../enums/responseKeyEnum';

export interface Response {
    Type: ResponseTypeEnum
    Key: ResponseKeyEnum
    Message: string
    Data?: object
    Nonce?: string
}