<template>
    <div>
        <div ref="container"></div>
        <div class="content">
            <div class="title">
                <h1>汽车展示与选配</h1>
            </div>
            <p>颜色选择</p>
            <div class="select">
               
                <div class="select-item" v-for="(item, index) in colorList" @click="selectColor(index)" :key="index">
                    <div class="select-item-color" :style="{ backgroundColor: item }"></div>
                </div>
            </div>
            <p>贴膜材质</p>
            <div class="select">
                <div class="select-item" v-for="(item, index) in materialList" @click="selectMaterial(item.value)" :key="index">
                    <div class="select-item-text">{{item.name}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as THREE from 'three'
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入加载器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
//导入模型加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
//导入动画库
import gsap from 'gsap'
// 导入UI界面控制库
import * as dat from 'dat.gui'

export default {
    name: 'App',
    data() {
        return {
            wheels: [],
            carBody: null,
            frontCar: null,
            hoodCar: null,
            glassCar: null,
            bodyMaterial: null,
            frontMaterial: null,
            hoodMaterial: null,
            glassMaterial: null,
            wheelsMaterial: null,
            colorList: [
                "red", "blue", "green", "pink", "orange", "purple"
            ],
            materialList:[
                {name:'磨砂',value:1},
                {name:'冰晶',value:0}
            ],
            renderId:''
        }
    },
    methods: {
        getMaterial() {
            this.bodyMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xff0000,
                metalness: 1,//金属
                roughness: 0.5,//粗糙
                clearcoat: 1,//清晰
                clearcoatRoughness: 0
            })
            this.frontMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xff0000,
                metalness: 1,
                roughness: 0.5,
                clearcoat: 1,
                clearcoatRoughness: 0
            })
            this.hoodMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xff0000,
                metalness: 1,
                roughness: 0.5,
                clearcoat: 1,
                clearcoatRoughness: 0
            })
            this.wheelsMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xff0000,
                metalness: 1,
                roughness: 0.5,
            })
            this.glassMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transmission: 1,
                metalness: 0,
                roughness: 0,
                transparent: true,
            })

        },
        initLight(scene) {
            // 添加光源
            const light = new THREE.PointLight(0xffffff, 2);
            light.position.set(10, 0, 5);
            light.castShadow = true//投射阴影
            scene.add(light);
            const light1 = new THREE.PointLight(0xffffff, 2);
            light.position.set(-5, 0, 5);
            light.castShadow = true//投射阴影
            scene.add(light1);
            const light2 = new THREE.PointLight(0xffffff, 2);
            light.position.set(5, 0, -5);
            light.castShadow = true//投射阴影
            scene.add(light2);
            const light3 = new THREE.PointLight(0xffffff, 2);
            light.position.set(0, 10, 0);
            light.castShadow = true//投射阴影
            scene.add(light3);
        },
        initModel(scene) {
            // 模型加载器
            const modelLoader = new GLTFLoader()
            //解压
            const dracoLoader = new DRACOLoader()
            dracoLoader.setDecoderPath('./car/draco/gltf/')
            modelLoader.setDRACOLoader(dracoLoader)
            modelLoader.load('./car/model/bmw01.glb', (model) => {
                const bmw = model.scene
                bmw.traverse(child => {
                    //判断是否是轮毂
                    if (child.isMesh && child.name.includes("轮毂")) {
                        child.material = this.wheelsMaterial
                        this.wheels.push(child)
                    }
                    // 判断是否是车身
                    if (child.isMesh && child.name.includes("Mesh002")) {
                        this.carBody = child
                        this.carBody.material = this.bodyMaterial
                    }
                    //判断是否是前列
                    if (child.isMesh && child.name.includes("前脸")) {
                        this.frontCar = child
                        child.material = this.frontMaterial
                    }
                    // 判断是否是引擎盖
                    if (child.isMesh && child.name.includes("引擎盖_1")) {
                        this.hoodCar = child
                        child.material = this.hoodMaterial
                    }
                    if (child.isMesh && child.name.includes("挡风玻璃")) {
                        this.glassCar = child
                        child.material = this.glassMaterial
                    }

                })
                model.castShadow = true
                scene.add(bmw)
            })
        },
        selectColor(index) {
            this.bodyMaterial.color.set(this.colorList[index])
            this.frontMaterial.color.set(this.colorList[index])
            this.hoodMaterial.color.set(this.colorList[index])
            this.wheelsMaterial.color.set(this.colorList[index])
        },
        selectMaterial(value){
            this.bodyMaterial.clearcoatRoughness=value
        }
    },
    mounted() {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#ccc')
        scene.environment = new THREE.Color('#ccc')
        //创建透视相机
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        camera.position.set(2, 1, 4)
        camera.updateProjectionMatrix()
        scene.add(camera)

        // 初始化光源
        this.initLight(scene)
        //初始化车辆材质
        this.getMaterial()

        // 添加网格地面
        const gridHelper = new THREE.GridHelper(20, 20)
        gridHelper.opacity = 1
        //允许材质透明
        gridHelper.material.transparent = true
        //允许接收阴影
        gridHelper.receiveShadow = true
        scene.add(gridHelper)


        const material = new THREE.MeshStandardMaterial({
            metalness: 0.7,//金属度
            roughness: 0.2//粗糙度
        })
        // 创建一个平面
        const planeGemoetry = new THREE.PlaneGeometry(20, 20)//width,height
        const plane = new THREE.Mesh(planeGemoetry, material)
        plane.rotation.x = -Math.PI / 2 //绕x周旋转-90度
        plane.receiveShadow = true//接收阴影
        scene.add(plane)
        //初始化模型
        this.initModel(scene)

        const renderer = new THREE.WebGLRenderer({
            // 抗锯齿
            antialias: true,
            // 对数深度缓冲区
            logarithmicDepthBuffer: true,
        })
        //允许阴影映射
        renderer.shadowMap.enableed = true
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

        const clock=new THREE.Clock()
        // 渲染函数  
        const render = ()=> {
            //小球光源绕y轴运动
            let time=clock.getElapsedTime()
            camera.position.x=Math.sin(time/2)*6
            camera.position.z=Math.cos(time/2)*6
            camera.lookAt(0,0,0)
            camera.updateProjectionMatrix()
            renderer.render(scene, camera)
            this.renderId=requestAnimationFrame(render)
            console.log(111);
        }
        render()
    },
    beforeDestroy(){
        cancelAnimationFrame(this.renderId)
    }
}
</script>

<style scoped>
.content {
    position: fixed;
    right: 0;
    top: 100px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
}

.select {
    display: flex;
    justify-content: space-around;
}

.select-item-color {
    width: 50px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px;
    display: inline-block;
    cursor: pointer;
}
.select-item-text{
    width: 50px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px;
    display: inline-block;
    cursor: pointer;
    background-color: #000;
    color:#fff;
    text-align: center;
}
</style>
