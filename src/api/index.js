import request from '../utils/request';

export const elements = query => {
    return request({
        url: 'element/list',
        method: 'post',
        data: query
    });
};
