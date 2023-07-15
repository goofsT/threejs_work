<template>
  <div id="app">
    <div class="box" @click="toFirst">球体房间</div>
    <div class="box" @click="toSecond">正方体房间</div>
    <div class="box" @click="toThird">小岛</div>
    <div class="box" @click="toBear">小熊</div> 
    <div class="box" @click="toCar">汽车展厅</div> 
    <div class="box" @click="toCard">3D贺卡</div> 
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods:{
    toFirst(){
      this.$router.replace('/sphere')
    },
    toSecond(){
      this.$router.replace('/geometry')
    },
    toThird(){
      this.$router.replace('/islet')
    },
    toBear(){
      this.$router.replace('/bear')
    },
    toCar(){
      this.$router.replace('/car')
    },
    toCard(){
      this.$router.replace('/card')
    }
  }
}
</script>

<style >
* {
  margin: 0;
  padding: 0;
}
.box{
  background:skyblue;
  width:100px;
  height:50px;
  float:left;
  margin:10px;
  color:#fff;
  text-align:center;
  line-height:50px;
  border-radius: 10px;
}
.box:hover{
  cursor: pointer;
}

</style>
