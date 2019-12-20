<template>
  <div class="customKanban">
    <visualization></visualization>
  </div>
</template>

<script>
  import visualization from '@/components/visualization'
  export default {
    name: "custom-kanban",
    components: {
      visualization,
    },
  }
</script>

<style scoped lang="scss" rel="text/css">
  .customKanban {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
  }
</style>
