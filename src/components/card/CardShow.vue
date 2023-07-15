<template>
  <div>
    <div ref="container"></div>
    <div ref="textContent" class="text" :style="{ transform: `translate3d(0,${-current * 100}vh,0)` }">
      <div v-for="(item, index) in scenes" :key="index" style="width:100vw;height:100vh">
        <h1 style="padding:100px 50px;font-size:50px;color:#fff">{{ item.text }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
//引入动画库
import gsap from 'gsap';
import * as THREE from 'three'
//导入加载器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
//导入模型加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { Water } from 'three/examples/jsm/objects/Water2';
export default {
  name: 'CardShow',
  data() {
    return {
      scene: null,
      camera: null,
      controls: null,
      isAnimate: false,
      starInstance: null,
      scenes: [
        {
          text: 'Hello', callback: () => {
            //切换视角
            this.cameraMove(new THREE.Vector3(-3.23, 3, 4.06), new THREE.Vector3(-8, 2, 0))
          }
        },
        {
          text: 'Three', callback: () => {
            //切换视角
            this.cameraMove(new THREE.Vector3(7, 0, 23), new THREE.Vector3(0, 0, 0))
          }
        },
        {
          text: '与你探寻世界每个角落', callback: () => {
            //切换视角
            this.cameraMove(new THREE.Vector3(10, 3, 0), new THREE.Vector3(5, 2, 0))
          }
        },
        {
          text: '聪哥吃粑粑', callback: () => {
            //切换视角
            this.cameraMove(new THREE.Vector3(7, 0, 23), new THREE.Vector3(0, 0, 0))
          }
        },
        {
          text: '一吃一大把', callback: () => {
            //切换视角
            this.cameraMove(new THREE.Vector3(-20, 1.3, 6.6), new THREE.Vector3(0, 0, 0))
          }
        }
      ],
      timeLines: {
        //创建时间轴
        t1: gsap.timeline(),
        t2: gsap.timeline()
      },
      current: 0,
      startStarArr: [],
      endStarArr: []
    }
  },
  methods: {
    //初始化相机场景渲染器等
    init() {
      const scene = new THREE.Scene()
      this.scene = scene
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      this.camera = camera
      camera.position.set(-3.23, 2.98, 4.06)
      // camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      scene.add(camera)

      //初始化渲染器
      const renderer = new THREE.WebGLRenderer({
        antialias: true,//抗锯齿

      })
      renderer.shadowMap.enabled = true//允许阴影映射
      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.toneMapping = THREE.ACESFilmicToneMapping,//色调映射
        renderer.physicallyCorrectLights = true
      renderer.toneMappingExposure = 0.5
      //渲染器宽高
      renderer.setSize(window.innerWidth, window.innerHeight)
      //添加画布
      this.$refs.container.appendChild(renderer.domElement)
      //初始化控制器
      const controls = new OrbitControls(camera, renderer.domElement)
      this.controls = controls
      controls.enableDamping = true//阻尼
      //渲染函数
      let skip
      const render = () => {
        renderer.render(scene, camera)
        controls.update()
        this.renderId = requestAnimationFrame(render)
        if (skip !== 0) {
          skip = ++skip % 2
          return
        } else {
          skip = ++skip % 2;
        }
      }
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
      render()
    },
    //初始化模型
    initModel() {
      // 模型加载器
      const dracoLoader = new DRACOLoader()
      const modelLoader = new GLTFLoader()
      dracoLoader.setDecoderPath('./car/draco/gltf/')
      modelLoader.setDRACOLoader(dracoLoader)
      //加载模型
      modelLoader.load('./card/model/scene.glb', (model) => {
        const s = model.scene
        model.castShadow = true
        s.traverse(child => {
          if (child.name === 'Plane') {
            child.visible = false//隐藏
          }
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        this.scene.add(s)
      })
      //创建圆形平面
      const waterGemetry = new THREE.CircleGeometry(300, 32)
      //创建水面
      const water = new Water(waterGemetry, {
        textureWidth: 1024,
        textureHeight: 1024,
        color: 0xeeeeff,
        flowDirection: new THREE.Vector2(1, 1),
        scale: 100,
      })
      water.rotation.x = -Math.PI / 2
      water.position.y = -0.4
      this.scene.add(water)

    },
    // 初始化灯光
    initLight() {
      // 添加平行光
      const light = new THREE.DirectionalLight(0xffffff, 0.6)
      light.position.set(0, 50, 0)
      this.scene.add(light)

      //添加点光源
      const pointLight = new THREE.PointLight(0xffffff, 50)
      pointLight.position.set(0.1, 2.4, 0)//位置
      pointLight.castShadow = true//阴影
      this.scene.add(pointLight)

      // 创建三个球体当作光源
      const pointLightGroup = new THREE.Group()
      pointLightGroup.position.set(-8, 2.5, -1.5)
      let pointLightArr = []
      let radius = 3
      for (let i = 0; i < 3; i++) {
        let pointLight = new THREE.PointLight(0xffffff, 50)//创建光源
        const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);//创建球
        const sphereMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 1,
        })
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.position.set(
          radius * Math.cos((i * 2 * Math.PI) / 3),
          Math.cos((i * 2 * Math.PI) / 3),
          radius * Math.sin((i * 2 * Math.PI) / 3)
        )
        sphere.add(pointLight)
        pointLightArr.push(sphere)
        pointLightGroup.add(sphere)
      }
      this.scene.add(pointLightGroup)

      // 定义旋转动画
      let options = {
        angle: 0
      }
      gsap.to(options, {
        angle: Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: 'linear',
        onUpdate: () => {
          pointLightGroup.rotation.y = options.angle
          pointLightArr.forEach((item, i) => {
            item.position.set(
              radius * Math.cos((i * 2 * Math.PI) / 3),
              Math.cos((i * 2 * Math.PI) / 3 + options.angle * 5),
              radius * Math.sin((i * 2 * Math.PI) / 3)
            )
          })
        }
      })
    },
    //初始化天空纹理
    initEnvironmentTexture() {
      const rgbeLoader = new RGBELoader()
      //加载天空纹理
      rgbeLoader.load('/card/textures/sky.hdr', texture => {
        //修改纹理映射方式
        texture.mapping = THREE.EquirectangularReflectionMapping
        this.scene.background = texture
        this.scene.environment = texture
      })

    },
    change() {
      //监听滚轮事件
      window.addEventListener('mousewheel', (e) => {
        if (this.isAnimate) return;
        if (e.deltaY > 0) {
          this.current++
          if (this.current > this.scenes.length - 1) {
            this.current = 0
            // this.current=this.scenes.length-1
          }
          //执行对应场景的回调
          this.isAnimate = true
          this.scenes[this.current].callback()
        }

      })
    },
    //相机移动
    cameraMove(position, targetLookAt) {
      // 相机移动
      this.timeLines.t1.to(this.camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          this.isAnimate = false
        }
      })
      // 控制器改变
      this.timeLines.t2.to(this.controls.target, {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          this.isAnimate = false
        }
      })
      this.initStars()
    },
    //防抖函数
    debounce(func, dalay = 100, immediate = true) {
      let timer, callNow = immediate;
      return (...args) => {
        if (timer) clearTimeout(timer);
        if (callNow) {
          func(...args);
          callNow = false;
        }
        timer = setTimeout(() => {
          func(...args);
        }, dalay)
      }
    },
    //星星
    initStars() {
      const starInstance = new THREE.InstancedMesh(
        new THREE.SphereBufferGeometry(0.1, 32, 32),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 10
        }),
        100//100个
      )
      this.starInstance = starInstance
      for (let i = 0; i < 100; i++) {
        let x = Math.random() * 100 - 50
        let y = Math.random() * 100 - 50
        let z = Math.random() * 100 - 50
        this.startStarArr.push(new THREE.Vector3(x, y, z))
        //创建矩阵
        let matrix = new THREE.Matrix4()
        matrix.setPosition(x, y, z)
        //设置对应矩阵
        starInstance.setMatrixAt(i, matrix)
      }
      this.scene.add(starInstance)
    },
  },
  mounted() {
    this.init()
    this.initModel()
    this.initLight()
    this.initEnvironmentTexture()
    this.initStars()
    this.change()
  },
  beforeDestroy() {
    cancelAnimationFrame(this.renderId)
  }

}
</script>

<style>
.text {
  position: fixed;
  left: 25px;
  top: 150px;
  color: #fff;
  font-size: 20px;
  pointer-events: none;
  transition: all 1s;
  z-index: 999;
}
</style>
