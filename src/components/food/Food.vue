<template>
	<transition name="move">
		<div class="food-wrapper" v-show="showFlag">
			<i class="icon-arrow_lift" @click="hide"></i>
			<div class="back-wrapper" :class="{'head-shadow':showBackHead}">
				<transition name="scroll">
					<div class="title" v-show="showBackHeadTitle" v-cloak>{{food.name}}</div>   
				</transition>
			</div>
			<div class="food-scroll" ref="foodScroll">
			  <div class="food" ref="food">
			  	<div class="food-content">
			  		<div class="image-header" ref="imgHeader">
			  			<img :src="food.image">
			  		</div>
			  		<div class="content">
			  			<h1 class="title" v-cloak>{{food.name}}</h1>
			  			<div class="detail">
			  				<span class="sell-count" v-cloak>月售{{food.sellCount}}份</span>
			  				<span class="rating">好评率{{food.rating}}%</span>
			  			</div>
			  			<div class="price">
			  				<span class="now">¥{{food.price}}</span>
			  				<span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
			  			</div>
			  		</div>
			  		<div class="cartcontrol-wrapper">
			  			<Cartcontrol @add="addFood" :food="food"></Cartcontrol>
			  		</div>
			  		<transition name="fade">
				  		<div 
				  			class="buy" 
				  			v-show="!food.count || food.count===0" 
				  			@click.stop.prevent="addFirst"
				  		>加入购物车</div>
			  		</transition>
			  	</div>
			  	<div class="split border-tb" v-show="food.info"></div>
			  	<div class="info" v-show="food.info">
			  		<div class="title">商品信息</div>
			  		<p class="text" v-cloak>{{food.info}}</p>
			  	</div>
			  	<div class="split border-tb"></div>
			  	<div class="rating">
			  		<h1 class="title">商品评价</h1>
			  		<Ratingselect 
			  			:selectType="selectType"
			  			:onlyContent="onlyContent"
			  			:desc="desc"
			  			:ratings="food.ratings"
			  			@select="selectRating"
			  			@toggle="toggleContent"
			  		>
			  		</Ratingselect>	
			  		<div class="rating-wrapper">
			  			<ul v-show="food.ratings && food.ratings.length">
			  				<li 
			  					v-for="rating in food.ratings" 
			  					v-if="needShow(rating.rateType,rating.text)" 
			  					class="rating-item border-1px"
			  				>
			  					<div class="user">
			  						<span class="name" v-cloak>{{rating.username}}</span>
			  						<img :src="rating.avatar" class="avatar" width="12" height="12">
			  					</div>
			  					<div class="time" v-cloak>{{rating.rateTime | formatDate}}</div>
			  					<p class="text" v-cloak>
			  						<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
			  					</p>
			  				</li>
			  			</ul>
			  			<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
			  		</div>
			  	</div>
			  </div>
		  </div>
	  </div>
	</transition>
</template>

<script> // type="text/ecmascript-6"
	import Vue from 'vue';
	import BScroll from 'better-scroll';
	import {formatDate} from 'common/js/date';
	import Cartcontrol from 'components/cartcontrol/Cartcontrol';
	import Ratingselect from 'components/ratingselect/Ratingselect';

	const POSITIVE = 0;  // 正向评价
	const NEGATIVE = 1;	 // 负向评价
	const ALL = 2;			 // 所有评价
	
	export default {
		name: 'Food',
		data() {
			return {
				showFlag: false,
				showBackHead: false,   		 // 显示头部导航栏
				showBackHeadTitle: false,  // 显示头部标题
				scrollY: 0,       			 	 // 向上滚动的距离 用于判断导航栏的显示和标题的出现
				selectType: ALL,     			 // 默认选中展示全部内容
				onlyContent: true,				 // 仅显示有内容的评价
				desc: {                    // 三种类型的种类
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			};
		},
		props: {
			food: {
				type: Object
			}
		},
		computed: {
			screenHeight() {
				return document.body.clientHeight || document.documentElement.clientHeight;
			}
		},
		methods: {
			show() {
				this.showFlag = true;
				this.selectType = ALL;
				this.onlyContent = true;  // 页面显示初始化默认显示全部评价和有内容的评价
				this.$nextTick(() => {    // 当页面展示就加上滚动
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.foodScroll,{
							click: true,
							probeType: 3
						})
					} else {
						this.scroll.refresh();  // 重新刷新计算dom
					}
					// 判断滚动的距离
					this.scroll.on('scroll', (pos) => {
		  			this.scrollY = Math.abs(Math.round(pos.y)); 
		  			if (this.scrollY > (this.$refs.imgHeader.offsetWidth - 48)) {
			  			this.showBackHead = true;
		  			} else {
		  				this.showBackHead = false;
		  			}
		  			if (this.scrollY > (this.$refs.imgHeader.offsetWidth - 26)) {
		  				this.showBackHeadTitle = true;
		  			} else {
		  				this.showBackHeadTitle = false;
		  			}
		  		});
				});
			},
			hide() {
				this.showFlag = false;
				this.showBackHeadTitle = false;
				this.showBackHead = false;
				// 重置滚动位置 让下一次进入这个页面是从顶部展示
				this.scroll.scrollTo(0,0,0);
			},
			addFirst(event) {
				if (!event._constructed) return;
				this.addFood(event.target);
				Vue.set(this.food,'count',1);
			},
			addFood(target) {
        this.$emit('add', target);
      },
      selectRating(type) {
      	this.selectType = type;
      	this.$nextTick(() => {
      		this.scroll.refresh();	
      		// 筛选条件的更改导致显示内容的更改高度也变了，DOM更新重绘BS也要刷新
      	})
      },
      toggleContent() {
      	this.onlyContent = !this.onlyContent;
      	this.$nextTick(() => {
      		this.scroll.refresh();	
      	})
      },
      needShow(type,text) {
      	// 通过v-if 或者 v-show 的 条件判断去筛选 相应条件的评论显示
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
			Cartcontrol,
			Ratingselect
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../common/scss/mixin';

	.food-wrapper{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 48px;     //   一定要这个bottom 通过这个bottom来获取到他的高度
		z-index: 30;
		width: 100%;
		background-color: #FFF;
		transform: translate3d(0, 0, 0);
		&.move-enter-active,&.move-leave-active{
			transition: all .5s cubic-bezier(.15,.53,0,1);
		}
		&.move-enter,&.move-leave-active{
			transform: translate3d(100%, 0, 0);
		}
		.icon-arrow_lift{
			position: fixed;
			top: 8px;
			left: 6px;
			display: block;
			padding: 6px;
			font-size: 20px;
			color: #FFF;
			z-index: 31;
		}
		.back-wrapper{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 48px;
			line-height: 48px;
			font-size: 18px;
			font-weight: 700;
			color: #FFF;
			background-color: rgba(3, 152, 255, 0);
			background-image: url(../../common/images/hbg.png);
			background-repeat: repeat;
			z-index: 30;
			text-align: center;
			transition: all .3s ease-in-out;
			&.head-shadow{
				 background-color: rgba(3, 152, 255, 1);
				 background-image: none;
			}
		}
		.title{
			opacity: 1;
			transform: translate3d(0, 0, 0);
			&.scroll-enter-active,&.scroll-leave-active{
				transition: all .3s ease-in-out;
			}
			&.scroll-enter,&.scroll-leave-active{
				opacity: 0;
				transform: translate3d(0, 48px, 0);
			}
		}
	}
	
	.food-scroll{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;    // 同上 不然不能滚动
		width: 100%;
		z-index: 29;
		overflow: hidden;
		.food{
			padding-bottom: 20px;
			margin-bottom: 48px;
		}
		.food-content{
			position: relative;
		}
		.icon-arrow_lift{
			position: fixed;
			top: 8px;
			left: 6px;
			display: block;
			padding: 6px;
			font-size: 20px;
			color: #FFF;
			z-index: 30;
		}
		.image-header{
			position: relative;
			width: 100%;
			height: 0;
			padding-top: 100%;    // 当高度为0时padding百分百就撑开了这个容器，而且这个padding是根据你的宽度来计算的并且等于你的宽度，也就是一个正方形的容器；
			&>img{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
		}
		.content{
			padding: 18px;
			.title{
				line-height: 14px;
				margin-bottom: 8px;
				font-size: 14px;
				font-weight: 700;
				color: rgb(7, 17, 27);
			}
			.detail{
				margin-bottom: 18px;
				height: 10px;
				line-height: 10px;
				font-size: 0;
				.sell-count,.rating{
					font-size: 10px;
					color: rgb(147, 153, 159);
				}
				.sell-count{
					margin-right: 12px;
				}
			}
			.price{
				font-weight: 700;
				line-height: 24px;
				.now{
					margin-right: 8px;
					font-size: 14px;
					color: rgb(240, 20, 20);
				}
				.old{
					text-decoration: line-through;
					font-size: 10px;
					color: rgb(147, 153, 159);
				}
			}
		}
		.cartcontrol-wrapper{
			position: absolute;
			right: 12px;
			bottom: 12px;
		}
		.buy{
			position: absolute;
			right: 18px;
			bottom: 18px;
			z-index: 10;
			height: 24px;
			line-height: 24px;
			padding: 0 12px;
			box-sizing: border-box;
			border-radius: 12px;
			font-size: 10px;
			color: #FFF;
			background-color: #0389FF;
			opacity: 1;
			&.fade-enter,&.fade-leave-active{
				transition: all .3s;
			}
			&.fade-enter-active,&.fade-leave-active{
				opacity: 0;
			}
		}
		.info{
			padding: 18px;
			.title{
				line-height: 14px;
				margin-bottom: 6px;
				font-size: 14px;
				color: rgb(7, 17, 27);
			}
			.text{
				line-height: 24px;
				padding: 0 8px;
				font-size: 12px;
				color: rgb(77, 85, 93);
				text-align: justify;
			}
		}
		.rating{
			padding-top: 18px;
			.title{
				line-height: 14px;
				margin-left: 18px;
				font-size: 14px;
				color: rgb(7, 17, 27);
			}
			.rating-wrapper{
				padding-left: 18px;
				.rating-item{
					position: relative;
					padding: 16px 0;
					@include border-1px(rgba(7, 17, 27,0.1));
					.user{
						position: absolute;
						right: 18px;
						top: 16px;
						line-height: 12px;
						font-size: 0;
						.name{
							display: inline-block;
							vertical-align: top;
							font-size: 10px;
							color: rgb(147, 153, 159);
							margin: 1px 6px 0 0;
						}
						.avatar{
							border-radius: 50%;
						}
					}
					.time{
						margin-bottom: 6px;
						line-height: 12px;
						font-size: 10px;
						color: rgb(147, 153, 159);
					}
					.text{
						padding-right: 18px;
						line-height: 16px;
						font-size: 12px;
						color: rgb(7, 17, 27);
						text-align: justify;
						&>.icon-thumb_up,&>.icon-thumb_down{
							display: inline-block;
							margin: 2px 4px 0 0;
							vertical-align: top;
							font-size: 12px;
						}
						&>.icon-thumb_up{
							color: rgb(0, 160, 220)
						}
						&>.icon-thumb_down{
							color: rgb(147, 153, 159)
						}
					}
				}
				.no-rating{
					padding: 16px 0;
					font-size: 12px;
					color: rgb(147, 153, 159);
					text-align: center;
				}
			}
		}
	}
</style>