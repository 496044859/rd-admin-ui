<template>
  <div>
    <i class="icon-menu hamburger" @click="toggleClick" :class="{'is-active':isActive}"></i>
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style>
.hamburger {
  cursor: pointer;
  font-size: 24px;
  transform: rotate(90deg);
  transition: .38s;
  transform-origin: 50% 50%;
  color: #666;
}

.hamburger.is-active {
  transform: rotate(0deg);
}
</style>
