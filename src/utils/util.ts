// 根据当前时间随机生成uniqueId
export function uniqueId() {
    return new Date().getTime().toString();
}