let validateConstant = (rule, value, callback,valueType) => {
    if (value===''){
        callback(new Error('不能为空'));
        return
    }
    if (valueType === 'BOOLEAN') {
        if (value !== 'true' && value !== 'false') {
            callback(new Error('布尔类型只能是true或false'));
        }
    } else if (valueType === 'NUMBER') {
        if (isNaN(Number(value))) {
            callback(new Error('不是数字类型'));
        }
    }else if (valueType === 'COLLECTION') {
        if (!Array.isArray(JSON.parse(value))) {
            callback(new Error('不是数组类型，数组类型格式为[1,2,3]'));
        }
    } else if (valueType === 'JSONOBJECT') {
        if (typeof JSON.parse(value) !== 'object' || Array.isArray(JSON.parse(value))) {
            callback(new Error('不是JSON类型，json类型为{...}'));
        }
    } else {
        callback();
    }
}
export default validateConstant