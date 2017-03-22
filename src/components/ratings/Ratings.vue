<template>
  <div class="ratings"  ref="ratings">
  	<div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <div class="score" v-cloak>
            {{seller.score}}
          </div>  
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <Star :size="36" :score="seller.serviceScore"></Star>
            <span class="score" v-cloak>{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <Star :size="36" :score="seller.foodScore"></Star>
            <span class="score" v-cloak>{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div> 
      <div class="split border-tb"></div>
      <Ratingselect 
        :selectType="selectType"
        :onlyContent="onlyContent"
        :ratings="ratings"
        @select="selectRating"
        @toggle="toggleContent"
      ></Ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item border-1px" v-if="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name" v-cloak>{{rating.username}}</h1>
              <div class="star-wrapper">
                <Star :size="24" :score="rating.score"></Star>
                <span class="delivery" v-show="rating.deliveryTime" v-cloak>{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text" v-cloak>{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend" v-cloak>{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import Star from 'components/star/Star';
  import Ratingselect from 'components/ratingselect/Ratingselect';
  import {formatDate} from 'common/js/date';

  const ALL = 2;
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ERROR_OK = 0;

	export default{
	  name: 'Ratings',
    props: {
      seller:{
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        showFlag: false,
        selectType: ALL,
        onlyContent: true
      };
    },
    created() {
      this.$http.get('/api/ratings').then(res => {
        return res.json();
      }).then(json => {
        if(json.errno === ERROR_OK) {
          this.ratings = json.data;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            });
          })
        }
      })
    },
    methods: {
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        })
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        })
      },
      needShow(type,text) {
        if (this.onlyContent && !text) {   // 当选中只显示有内容评价，并且评价为空则返回false过滤掉
          return false;
        }
        if (this.selectType === ALL) {  // 过了第一条之后 判断当前选中类型是否为全部
          return true;
        } else {
          return type === this.selectType;  // 否则显示 当前选中状态的评论
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      Star,
      Ratingselect
    }
	}
</script>

<style lang="scss" scoped>
  @import '../../common/scss/mixin';

	.ratings{
    position: absolute;
    top: 174px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .overview{
      display: flex;
      padding: 18px 0;
      .overview-left{
        padding: 6px 0;
        position: relative;
        flex: 0 0 137px;
        width: 137px;
        text-align: center;
        @media only screen and (max-width:320px){
          flex: 0 0 120px;
          width: 120px;
        }
        &:after{
          position: absolute;
          display: block;
          content: '';
          width: 1px;
          height: 100%;
          top: 0;
          right: 0;
          background-color: rgba(7, 17, 27, 0.1);
          transform: scaleX(0.5);
        }
        .score{
          margin-bottom: 4px;
          line-height: 28px;
          font-size: 24px;
          color: rgb(255, 153, 0)
        }
        .title{
          margin-bottom: 8px;
          line-height: 12px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
        .rank{
          padding-bottom: 6px;
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153,159);
        }
      }
      .overview-right{
        flex: 1;
        padding: 6px 0 6px 24px;
        @media only screen and (max-width:320px){
          padding-left: 6px;
        }
        .score-wrapper{
          margin-bottom: 8px;
          font-size: 0;
          .title,.star,.score{
            display: inline-block;
            vertical-align: top;
          }
          .title{
            line-height: 18px;
            font-size: 12px;
            color: rgb(7, 17, 27);
          }
          .star{
            margin: 0 12px;
          }
          .score{
            line-height: 18px;
            font-size: 12px;
            color: rgb(255, 153, 0);
          }
        }
        .delivery-wrapper{
          font-size: 0;
          .title{
            line-height: 18px;
            font-size: 12px;
            color: rgb(7, 17, 27)
          }
          .delivery{
            font-size: 12px;
            color: rgb(147, 153, 159);
            margin-left: 12px;
          }
        }
      }
    }
    .rating-wrapper{
      padding-left: 18px;
      .rating-item{
        display: flex;
        padding: 18px 18px 18px 0;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .avatar{
          flex: 0 0 28px;
          width: 28px;
          margin-right: 12px;
          &>img{
            border-radius: 50%;
          }
        }
        .content{
          position: relative;
          flex: 1;
          .name{
            margin-top: 4px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(7, 17, 27);
          }
          .star-wrapper{
            margin-bottom: 6px;
            font-size: 0;
            .star,.delivery{
              display: inline-block;
              vertical-align: top;
            }
            .star{
              margin-right: 6px;
            }
            .delivery{
              line-height: 12px;
              font-size: 10px;
              color: rgb(7, 17, 27);
            }
          }
          .text{
            margin-bottom: 8px;
            line-height: 18px;
            color: rgb(7, 17, 27);
            font-size: 12px;
            text-align: justify;
          }
          .recommend{
            line-height: 16px;
            font-size: 0;
            .icon-thumb_up, .item{
              display: inline-block;
              margin: 0 8px 4px 0;
              font-size: 9px;
            }
            .icon-thumb_up{
              color: rgb(2, 160, 220);
              vertical-align: top;
              margin-top: 4px;
            }
            .item{
              box-sizing: border-box;
              padding: 0 6px;
              border: 1px solid rgba(7, 17, 27, 0.1);
              border-radius: 2px;
              color: rgb(147, 153, 159);
              background-color: #FFF;
              max-width: 60px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .time{
            position: absolute;
            top: 0;
            right: 0;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
	}
</style>