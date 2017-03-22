<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item" ><!-- @click="food" -->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item" ><!-- @click="rating" -->
        <router-link to="/ratings">评论</router-link>  
      </div>
      <div class="tab-item" ><!-- @click="sellers" -->
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- <transition 
      name="slide"
      :enter-active-class="this.enter" 
      :leave-active-class="this.leave"
    > -->
      <keep-alive>
        <router-view :seller="seller" id="routerView"></router-view><!-- class="animated" -->
      </keep-alive>
    <!-- </transition> -->
  </div>
</template>

<script >// type="text/ecmascript-6"
  import {urlParse} from 'common/js/util'
  import header from 'components/header/Header'

  const ERR_OK = 0;  // 判断接收数据参数状态
  const FOOD = 0;
  const RATING = 1;
  const SELLER = 2;

  export default {
    name: 'app',
    data() {
      return {
        seller: {
          id: (() => {
            let queryParm = urlParse();
            // console.log(queryParm); 通过urlParse解析拿到页面商家信息和用户id 
            return queryParm.id;      // 立即自执行拿到id
          })()
        }
        // enter: 'slideInRight',
        // leave: 'slideOutLeft',
        // switchBox: 0,
        // flag: false
      }
    },
    created() {
      this.$http.get('/api/seller?id='+this.seller.id).then(res => {
        return res.json()
      }).then(json => {
        if (json.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, json.data);
          // Object.assign接收三个参数 创建一个新的对象，让它包含原对象的属性和新的属性
          // {}返回的新的对象，this.seller原对象，json.data新增的属性，也就实现了把di新增到了seller内
          // console.log(this.seller)
        }
      })
    },
    methods: {
      // food() {
      //   // this.$nextTick(() => {
      //   //   if (this.switchBox === RATING) {
      //   //     this.enter = 'slideInLeft';
      //   //     this.leave = 'slideOutRight';
      //   //   } else {
      //   //     this.enter = 'slideInRight';
      //   //     this.leave = 'slideOutLeft';
      //   //   }
      //   // })
      //   this.switchBox = FOOD;
      //   // this.flag = true;
      // },
      // rating() {
        
      //   // if (this.switchBox === SELLER) {
      //   //   this.enter = 'slideInRight';
      //   //   this.leave = 'slideOutLeft';
      //   // } else {
      //   //   this.enter = 'slideInLeft';
      //   //   this.leave = 'slideOutRight';
      //   // }
      //   this.switchBox = RATING;
      //   // this.flag = true;
      // },
      // sellers() {
        
      //   // if (this.switchBox === RATING) {
      //   //   this.enter = 'slideInLeft';
      //   //   this.leave = 'slideOutRight';
      //   // } else {
      //   //   this.enter = 'slideInLeft';
      //   //   this.leave = 'slideOutRight';
      //   // } 
      //   this.switchBox = SELLER;
      //   // this.flag = true;
      // },
      // beforeEnter() {
      //   // if () {

      //   // }
      // },
      // afterLeave() {

      // }
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="scss" scoped>
@import "common/scss/mixin.scss";
  .animated {
    -webkit-animation-duration: .5s;
    animation-duration: .5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  @-webkit-keyframes slideInLeft {
    from {
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
      visibility: visible;
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideInLeft {
    from {
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
      visibility: visible;
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  .slideInLeft {
    -webkit-animation-name: slideInLeft;
    animation-name: slideInLeft;
  }

  @-webkit-keyframes slideInRight {
    from {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      visibility: visible;
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideInRight {
    from {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      visibility: visible;
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  .slideInRight {
    -webkit-animation-name: slideInRight;
    animation-name: slideInRight;
  }

  @-webkit-keyframes slideOutLeft {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    to {
      visibility: hidden;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
    }
  }

  @keyframes slideOutLeft {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    to {
      visibility: hidden;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
    }
  }

  .slideOutLeft {
    -webkit-animation-name: slideOutLeft;
    animation-name: slideOutLeft;
  }

  @-webkit-keyframes slideOutRight {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    to {
      visibility: hidden;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
  }

  @keyframes slideOutRight {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    to {
      visibility: hidden;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
  }

  .slideOutRight {
    -webkit-animation-name: slideOutRight;
    animation-name: slideOutRight;
  }
  .tab{
    display: flex;
    width:100%;
    height:40px;
    line-height: 40px;
    @include border-1px(rgba(7,17,27,0.1));
    .tab-item{
      flex:1;
      text-align: center;
      &>a{
        display: block;
        font-size: 14px;    
        color:rgb(77,85,93);
        &.v-active{
          color:rgb(240,20,20);
        }
      }
    }
  }
</style>
