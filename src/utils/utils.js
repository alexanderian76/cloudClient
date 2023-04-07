export function getFileExtension(fileName) {
    let arr = fileName.split('.')
    arr.pop()
    return arr.join('.')
}