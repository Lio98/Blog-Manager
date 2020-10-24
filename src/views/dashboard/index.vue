<template>
  <div class="dashboard-container">
    {{info}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '@/api/test';

export default {
  data(){
    return{
      info:{}
    }
  },
  created(){
    this.Search()
  },
  methods:{
    Search(){
      api.test().then(response=>{
        this.info=response
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
