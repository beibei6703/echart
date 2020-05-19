import { Message } from 'element-ui';

export const successMsg = (data) => {
    Message({
        message: data,
        type: 'success',
        customClass: 'mzindex'

    });
};
export const errorMsg = (data) => {
    Message({
        message: data,
        type: 'error',
        customClass: 'mzindex'
    });
};
