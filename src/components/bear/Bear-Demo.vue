<template>
    <div class="container" ref="container">

    </div>
</template>

<script>
import * as THREE from 'three'
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入obj加载器
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
//导入MTL加载器
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'


export default {
    name: 'App',
    data(){
        return{
            renderId:''
        }
    },
    mounted() {
        // 初始化
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(50, 50, 100)
        //  更新相机宽高
        camera.aspect = window.innerWidth / window.innerHeight
        // 更新相机投影矩阵
        camera.updateProjectionMatrix()
        scene.add(camera)

        //平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        scene.add(directionalLight);

        //定义obj模型加载器
        const loader = new OBJLoader()
        //mtl加载器
        const mtlLoader = new MTLLoader()
        //创建纹理加载器
        const textrueLoader = new THREE.TextureLoader()

         //加载mtl文件
        mtlLoader.load('./bear/tree.mtl', function (material) {
            loader.setMaterials(material)
            // 加载模型
            loader.load('./bear/tree.obj', (mesh) => {
                mesh.scale.multiplyScalar(3)
                scene.add(mesh)
            })
        });

       
        //背景纹理
        const bgTexture = textrueLoader.load('./bear/imgs/050.jpg')
        //球形环境映射
        bgTexture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = bgTexture
        scene.environment = bgTexture


        //渲染器
        const renderer = new THREE.WebGLRenderer({
            // 抗锯齿
            antialias: true,
            // 对数深度缓冲区
            logarithmicDepthBuffer: true,
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
        const render = ()=> {
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

