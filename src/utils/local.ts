
export const setLocal = (key: string, value: string) => {
  return uni.setStorage({
    key: key,
    data: JSON.stringify(value),
  });
}
export const getLocal = (keys: string) =>{
  let value = uni.getStorageSync(keys)
  if (value) {
      return JSON.parse(value)
  } else {
      return value
  }
}

export const removeLocal = (key: string) => {
  return uni.removeStorage({
    key: key
  });
}
