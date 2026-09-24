<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import type { Activity } from '@/content'
import ActivityCard from './ActivityCard.vue'

const props = defineProps<{ activity: Activity | null }>()
const emit = defineEmits<{ close: [] }>()

/** 详情另开标签页，靠 query 复原，省掉一整套路由 */
const open = () => window.open(`${location.pathname}?activity=${encodeURIComponent(props.activity!.id)}`, '_blank')

onKeyStroke('Escape', () => props.activity && emit('close'))
</script>

<template lang="pug">
Transition(name="veil")
  .veil(v-if="activity", @click.self="emit('close')")
    .veil-slot(@click="open", title="点击查看详情")
      ActivityCard(:activity="activity")
</template>

<style lang="less" scoped>
.veil {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  place-items: center;
  place-content: center;
  padding: 2em;
  background-color: rgba(0, 0, 0, .52);
  backdrop-filter: blur(3px);

  @media (width < 768px) {
    padding: 1em;
  }
}

.veil-slot {
  width: min(52em, 92vw);
  height: min(26em, 70vh);
  cursor: pointer;

  .use-default-transition();

  &:hover {
    scale: 1.012;
  }

  @media (width < 768px) {
    height: min(24em, 72vh);
  }
}

.veil-enter-active, .veil-leave-active {
  transition: opacity .3s @ease-slide;

  .veil-slot {
    .use-slide-transition(~"transform, opacity");
  }
}

.veil-enter-from, .veil-leave-to {
  opacity: 0;

  .veil-slot {
    transform: translateY(1.2em) scale(.97);
  }
}
</style>
