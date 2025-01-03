
export const getUserChat =  (userId: string) => {
  return uni.getStorageSync(`chatMessages_${userId}`);
}
export const setUserChat =  (userId: string, newMessage: string) => {
  let chatMessages = getUserChat(`chatMessages_${userId}`) || [];
  chatMessages.push(newMessage);
  uni.setStorageSync(`chatMessages_${userId}`, chatMessages);
}