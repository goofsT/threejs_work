import VueRouter from "vue-router";
import Vue from "vue";
import Sphere from '@/components/vr-room/Sphere.vue'
import Geometry from '@/components/vr-room/Geometry.vue'
import Islet from '@/components/islet/Islet.vue'
import Bear from '@/components/bear/Bear-Demo.vue'
import CarShow from '@/components/car/CarShow.vue'
import CardShow from '@/components/card/CardShow.vue'
Vue.use(VueRouter)
export default new VueRouter({
    routes:[
        {
            path:'/sphere',
            name:'sphere',
            component:Sphere
        },
        {
            path:'/geometry',
            name:'geometry',
            component:Geometry
        },
        {
            path:'/islet',
            name:'islet',
            component:Islet
        },
        {
            path:'/bear',
            name:'bear-demo',
            component:Bear
        },
        {
            path:'/car',
            name:'car-demo',
            component:CarShow
        },
        {
            path:'/card',
            name:'card-demo',
            component:CardShow
        }
    ]
})