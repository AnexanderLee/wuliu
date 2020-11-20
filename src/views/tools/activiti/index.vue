<template>
  <elFrame :src="activitiUrl"/>
</template>
<script>
import { mapGetters } from 'vuex'
import elFrame from '@/components/iframe/index'
export default {
  components: { elFrame },

  computed: {
    ...mapGetters([
      'activiApi'
    ]),
    activitiUrl() {
      if (this.$route.query.id) {
        // editor?modelId
        //  + '&href=' + this.$route.query.href
        const url = this.activiApi + '?modelId=' + this.$route.query.id
        console.log('request:', url)
        return url
      } else {
        console.log('error url')
        return ''
      }
    }
  }
}
</script>
