<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { useReader } from '@/stores/reader'
import ActivityCard from './ActivityCard.vue'
import ActivityDetail from './ActivityDetail.vue'

const reader = useReader()

onKeyStroke('Escape', () => reader.activity && reader.close())
</script>

<template lang="pug">
Transition(name="veil")
  .veil(v-if="reader.activity", @click.self="reader.close()")
    ActivityDetail.veil-read(v-if="reader.view === 'detail'", :activity="reader.activity")
    .veil-slot(v-else)
      ActivityCard(:activity="reader.activity")
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
  container-type: inline-size;

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

  .veil-slot, .veil-read {
    .use-slide-transition(~"transform, opacity");
  }
}

.veil-enter-from, .veil-leave-to {
  opacity: 0;

  .veil-slot, .veil-read {
    transform: translateY(1.2em) scale(.97);
  }
}
</style>
