<template>
  <BeaverImage
    :fileName="avatarFileName"
    :mode="mode"
    :lazy-load="lazyLoad"
    :image-class="imageClass"
    :image-style="imageStyle"
    @load="$emit('load', $event)"
    @error="$emit('error', $event)"
    @click="$emit('click', $event)"
  />
</template>

<script lang="ts">
import { computed } from 'vue';
import BeaverImage from '../image/image.vue';
import { useFriendStore } from '@/pinia/friend/friend';
import { useGroupStore } from '@/pinia/group/group';
import { getChatType } from '@/utils/conversation';

export default {
  name: 'AvatarImage',
  components: {
    BeaverImage
  },
  props: {
    // 用户ID（用于获取用户头像）
    userId: {
      type: String,
      default: ''
    },
    // 会话ID（用于获取会话头像）
    conversationId: {
      type: String,
      default: ''
    },
    // 直接传入fileName（优先级最高）
    fileName: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'aspectFill'
    },
    lazyLoad: {
      type: Boolean,
      default: true
    },
    imageClass: {
      type: String,
      default: ''
    },
    imageStyle: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['load', 'error', 'click'],
  setup(props: any) {
    const friendStore = useFriendStore();
    const groupStore = useGroupStore();
    

    
    // 计算头像fileName
    const avatarFileName = computed(() => {
     
      
      // 优先级：直接传入的fileName > 根据conversationId获取 > 根据userId获取
      if (props.fileName) {
        console.log('Using direct fileName:', props.fileName);
        return props.fileName;
      }
      
      if (props.conversationId) {
        const chatType = getChatType(props.conversationId);
        
        if (chatType === 'single') {
          // 私聊：从好友列表获取
          const friendInfo = friendStore.getFriendByConversationId(props.conversationId);
          return friendInfo?.fileName;
        } else {
          // 群聊：从群组列表获取
          const groupInfo = groupStore.getGroupById(props.conversationId);
          return groupInfo?.fileName;
        }
      }
      
      if (props.userId) {
        // 从好友列表获取
        const friendInfo = friendStore.getFriendByUserId(props.userId);
        console.log('Friend info by userId:', friendInfo);
        return friendInfo?.fileName;
      }
      
      console.log('No avatar found, returning empty string');
      return '';
    });

    return {
      avatarFileName
    };
  }
};
</script>

<style lang="scss" scoped>
// 可以添加一些默认样式
</style> 