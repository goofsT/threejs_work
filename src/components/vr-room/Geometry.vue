<template>
       <div class="container" ref="container">
      </div>
</template>
  
<script>
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  export default {
    name: 'App',
    data(){
      return{
        living:["4_l","4_r","4_u","4_d","4_b","4_f"],
        boxMaerials:[]
      }
    },
    methods:{
      loadImages(){
        this.living.forEach(item=>{
          //纹理加载
          let texture=new THREE.TextureLoader()
          //加载图片
          const bg=texture.load(`./images/living/${item}.jpg`)
          if(item==='4_u'|| item==='4_d'){
            // 旋转角度
            bg.rotation=Math.PI
            //旋转中心
            bg.center=new THREE.Vector2(0.5,0.5)
          }
          this.boxMaerials.push(new THREE.MeshBasicMaterial({map:bg}))
        })
      },
      toSphere(){
        this.$router.push('/sphere')
      }
    },
    mounted() {
      //加载材质图片
      this.loadImages()
      //初始化场景
      const scene = new THREE.Scene()
      //创建相机（视锥体垂直视野角度,宽高比,近端面，远端面）
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      // 相机位置
      camera.position.z = 5
      //创建渲染器
      const renderer = new THREE.WebGLRenderer()
      //设置渲染范围
      renderer.setSize(window.innerWidth, window.innerHeight)
  
      //添加canvas
      this.$refs.container.appendChild(renderer.domElement)
  
      // 创建一个几何缓冲立方体  
      const geometry = new THREE.BoxGeometry(10, 10, 10)
      
      // 创建物体
      const cube = new THREE.Mesh(geometry, this.boxMaerials)
      cube.geometry.scale(1,1,-1)
      scene.add(cube)
  
      
      //添加轨道控制器
      const controls = new OrbitControls(camera, renderer.domElement)
      // 设置控制器阻尼，让控制器更真实
      controls.enableDamping = true
  
      // 监听尺寸变化
      window.addEventListener('resize', () => {
        //更新相机宽高比
        camera.aspect = window.innerWidth / window.innerHeight
        //更新相机投影矩阵
        camera.updateProjectionMatrix()
        //更新渲染器
        renderer.setSize(window.innerWidth, window.innerHeight)
        //更新渲染器像素比
        renderer.setPixelRatio(window.devicePixelRatio)
      })
      // 渲染函数  
      const render =()=> {
        renderer.render(scene, camera)
        this.renderId=requestAnimationFrame(render)
      }
      render()
    },
    beforeDestroy(){
      cancelAnimationFrame(this.renderId)
    }
  }
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  
  .container {
    height: 100vh;
    width: 100vw;
    background-color: #ccc;
  }
  .change{
    position: fixed;
    left: 0;
    top: 0;
    background-color: black;
    color:#fff;
    width: 100px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-radius:10px;
  }
  .change:hover{
    cursor: pointer;
  }
  </style>
  