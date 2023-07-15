<template>
    <div class="container" ref="container">

    </div>
</template>

<script>
import * as THREE from 'three'
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入水面
import {Water} from 'three/examples/jsm/objects/Water2'
//模型导入库
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
//解压模型库
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
//导入hdr图库
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import skyBg from '@/assets/islet/textures/sky.jpg'
import skyBgMp4 from '@/assets/islet/textures/sky.mp4'
export default {
    name: 'App',
    mounted() {
        // 初始化
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
        camera.position.set(100, 50, 250)
        //  更新相机宽高
        camera.aspect = window.innerWidth / window.innerHeight
        // 更新相机投影矩阵
        camera.updateProjectionMatrix()
        scene.add(camera)


        let texture=new THREE.TextureLoader().load(skyBg)
        // 创建一个面
        const sphereGeometry = new THREE.SphereGeometry(1000,100,100)
        //创建面的材质
        const sphereMaterial = new THREE.MeshBasicMaterial({
            //纹理
            map:texture,
        })
        //创建物体
        const cube = new THREE.Mesh(sphereGeometry, sphereMaterial)
        //翻转z
        cube.geometry.scale(1,1,-1)
        //添加到场景
        scene.add(cube)

        //添加平行光
        const light = new THREE.DirectionalLight( 0xffffff ,1.5); // soft white light
        light.position.set(-100,100,10)
        scene.add( light );

        //环境贴图
        const  hdrLoader=new RGBELoader()
        hdrLoader.loadAsync('./islet/assets/050.hdr').then(texture=>{
            texture.mapping=THREE.EquirectangularReflectionMapping
            scene.background=texture
            scene.environment=texture
        })


        // 创建视频    
        const video=document.createElement('video')
        video.src=skyBgMp4
        video.loop=true

        window.addEventListener('click',()=>{
            //鼠标移动时播放视频
            if(video.paused){
                video.play()
                //添加视屏纹理
                sphereMaterial.map=new THREE.VideoTexture(video)
                sphereMaterial.map.needsUpdate=true
            }
        })

        // 创建圆形平面(半径300,分段数64)
        const waterGemetry=new THREE.CircleBufferGeometry(300,64)
        const water=new Water(waterGemetry,{
            // 宽高
            textureWidth:1024,
            textureHeight:1024,
            color:0x0f8fff,
            //流向
            flowDirection:new THREE.Vector2(1,1),
            // 波纹大小
            scale:1
        })
        //旋转水面
        water.rotation.x=-Math.PI/2
        water.position.y=3
        scene.add(water)

        //添加小岛模型
        //gltg载入库
        const gltfLoader=new GLTFLoader()
        //draco载入库
        const dracoLoader=new DRACOLoader()
        dracoLoader.setDecoderPath('./islet/draco/')
        gltfLoader.setDRACOLoader(dracoLoader)    

        //加载模型
        gltfLoader.load("./islet/model/island2.glb",(gltfLoader)=>{
            scene.add(gltfLoader.scene)
        })



        


        const renderer = new THREE.WebGLRenderer({
            // // 对数深度缓冲区
            logarithmicDepthBuffer:true,
        })
        //定义渲染器的输出编码
        renderer.outputEncoding = THREE.sRGBEncoding
        //渲染器宽高
        renderer.setSize(window.innerWidth, window.innerHeight)
        //添加元素
        this.$refs.container.appendChild(renderer.domElement)
        
        
        
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
        const render = ()=>{
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
