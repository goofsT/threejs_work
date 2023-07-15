<template>
  <div class="container" ref="container">
  </div>
</template>
  
<script>
import * as THREE from 'three'
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入rbge加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
export default {
  name: 'App',
  mounted() {
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

    // 创建一个球缓冲几何体
    const geometry = new THREE.SphereGeometry(10, 32, 32)
    // 创建hdr环境图
    const rgbeLoader = new RGBELoader()
    //异步加载纹理
    rgbeLoader.loadAsync('./images/hdr/Living.hdr').then((textures) => {
      //创建材质，贴上贴图
      const material=new THREE.MeshBasicMaterial({map:textures})
      //创建物体
      const sphere=new THREE.Mesh(geometry,material)
      //反转z
      sphere.geometry.scale(1,1,-1)
      scene.add(sphere)



      // textures.mapping=THREE.EquirectangularReflectionMapping
      // scene.background=textures
      // scene.environment=textures
    })



    // 添加轨道控制器
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
    const render = function () {
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

<style>

</style>
  