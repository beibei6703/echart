// email 已支持 { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
const REG = {
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i,
    URLADDRESS: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i,
    PHONE: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
    IDCARD: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
    POSTCODE: /^[1-9]\d{5}(?!\d)$/
};

export function validateUrl(rule, value, callback) {
    if (value !== '' && !REG.URL.test(value)) {
        callback(new Error('请输入正确的url'));
    }
    callback();

}
export function validateAddress(rule, value, callback) {
    if (value) {
        if (!REG.PHONE.test(value)) {
            callback(new Error('请输入正确的url'));
        } else {
            callback();
        }
    } else {
        return callback();
    }
    // if (value !== '' && !REG.URLADDRESS.test(value)) {
    //     callback(new Error('请输入正确的url'));
    // } 
    // if (!value) {
    //     return callback();
    // }

}

export function validatePhone(rule, value, callback) {
    if (value !== '' && !REG.PHONE.test(value)) {
        callback(new Error('请输入正确的手机号码'));
    }
    callback();
}

export function validateIdCard(rule, value, callback) {
    if (value !== '' && !REG.IDCARD.test(value)) {
        callback(new Error('请输入正确的身份证号码'));
    }
    callback();
}

export function validatePostCode(rule, value, callback) {
    if (value !== '' && !REG.POSTCODE.test(value)) {
        callback(new Error('请输入正确的邮编'));
    }
    callback();
}
