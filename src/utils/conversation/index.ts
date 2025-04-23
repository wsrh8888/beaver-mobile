export const parseConversation = (conversationID: string, userId: string) =>{
  // 检查conversationID是否包含"_"
  if (conversationID.includes("_")) {
      // 使用 "_" 拆分 conversationID
      return conversationID.replace(/_/g, "").replace(userId, "").trim()
  }
  return conversationID
}

