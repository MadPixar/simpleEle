<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper" ref="logoWrapper" :class="{move_in_cart: receiveInCart}">
						<div class="logo" :class="{highlight: totalCount>0}">
							<span class="icon-shopping_cart" :class="{highlight: totalCount>0}"></span>
						</div>
						<div class="num" v-show="totalCount>0" v-cloak>
							{{totalCount}}
						</div>
					</div>
					<div class="price" :class="{highlight: totalPrice>0}" v-cloak>¥ {{totalPrice}}</div>
					<div class="desc" v-cloak>另需配送费 {{deliveryPrice}}元</div>
				</div>
				<div class="content-right" @click.stop.prevent="pay">
					<div class="pay" :class="payClass" v-cloak>
						{{payDesc}}
					</div>
				</div>
			</div>
			<div class="ball-container">
				<div v-for="ball in balls">
					<transition name="drop" 	
						@before-enter="beforeDrop" 
						@enter="dropping" 
						@after-enter="afterDrop">
	          <div class="ball" v-show="ball.show">
	            <div class="inner inner-hook"></div>
	          </div>
	        </transition>
				</div>
			</div>
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="listContent">
						<ul>
							<li class="food" v-for="food in selectFoods">
								<span class="name" v-cloak>{{food.name}}</span>
								<div class="price" v-cloak>
									<span>¥{{food.price*food.count}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<Cartcontrol @add="addFood" :food="food"></Cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div class="list-mask" @click="hideList" v-show="listShow"></div>
		</transition>
	</div>
</template>

<script> // type="text/ecmascript-6"
import Cartcontrol from 'components/cartcontrol/Cartcontrol';
import BScroll from 'better-scroll';
	export default {
		name: 'Shopcart',
		data() {
			return {
				receiveInCart: false,  //小球是否落到购物车
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBalls: [],		// 小球动画执行个数
				fold: true   		  // 购物车详情点击是否能展示
			};
		},
		props: {
			//向父组件拿数据
			selectFoods: {
				type: Array,
				default() {
					return [];
				}
			},
			deliveryPrice: {
				type: Number,
				default: 4
			},
			minPrice: {
				type: Number,
				default: 20
			}
		},
		computed: {
			// 遍历selectFoods 去计算出他的总体价格
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach(food => {
					total += food.price * food.count;
				});
				return total;
			},
			// 遍历selectFoods 去计算出他的商品总数
			totalCount() {
				let count = 0;
				this.selectFoods.forEach(food => {
					count += food.count;
				});
				return count;
			},
			payDesc() {
				if (this.totalPrice === 0) {
					//用${}来引入变量 `` ES6的字符串拼接
					return `${this.minPrice}元起送`;
				} else if (this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差${diff}元起送`;
				} else {
					return '去结算';
				}
			},
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true;
					return false;
				}
				let show = !this.fold;   // 根据fold的真假来判断是否展开
				if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
				return show;
			}
		},
		methods: {
			addFood(target) {
        this.drop(target);
      },
			drop(el) {
				for (let i = 0; i < this.balls.length; i++) {
					// 遍历出没用执行动画的小球，也就是为false的小球，然后添加到一个准备执行动画的数组中，这样就可以多个小球同时下落，拿到相应的dom和显示出来
					let ball = this.balls[i];
					if ( !ball.show ) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			beforeDrop(el) {
				this.receiveInCart = false;     
				//防止多次快速暴力点击造成animationend的监听重复导致中断不能重置，在新动画进入时强制重置。
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect(); // 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。就是相对于视口的位置，在IE中，默认坐标从(2,2)开始计算，导致最终距离比其他浏览器多出两个像素，我们需要做个兼容。
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22);
						el.style.display = ''; // 显示出来
						el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
						el.style.transform = `translate3d(0, ${y}px, 0)`;
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
						inner.style.transform = `translate3d(${x}px, 0, 0)`;
					}
				}
			},
			dropping(el) {
				/*这里要触发一次浏览器重绘*/
				let rf = el.offsetHeight; // 获取元素的高度 来触发浏览器的重绘
				this.$nextTick(() => {    // 进行重绘
					el.style.webkitTransform = 'translate3d(0, 0, 0)';
					el.style.transform = 'translate3d(0, 0, 0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0, 0, 0)';
					inner.style.transform = 'translate3d(0, 0, 0)';
				})
			},
			afterDrop(el) {
				let ball = this.dropBalls.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
				this.listenInCart();
			},
			listenInCart() {
        if (!this.receiveInCart) {
          this.receiveInCart = true;
          this.$refs.logoWrapper.addEventListener('animationend', () => {
            this.receiveInCart = false;
          })
        }
    	},
    	toggleList() {
    		if (!this.totalCount) return;
    		this.fold = !this.fold;   // 通过点击来切换fold的真假实现展开收起的切换
    	},
    	empty() {
    		if (confirm("确认清空？")) {
	    		this.selectFoods.forEach(food => {
	    			food.count = 0;
	    		});
	    	}
    	},
    	hideList() {
    		this.fold = true;
    	},
    	pay() {
    		if (this.totalPrice < this.minPrice) return;
    		alert(`请支付${this.totalPrice}元`);
    	}
    },
    components: {
    	Cartcontrol
    }
	}
</script>

<style lang="scss" scoped>
@import '../../common/scss/mixin';

	@keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  @-webkit-keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
	.shopcart{
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 59;
		width: 100%;
		height: 48px;
		.content{
			display: flex;
			background-color: #141D27;
			font-size: 0;
			color: rgba(255, 255, 255, 0.4);
			.content-left{
				flex: 1;
				.logo-wrapper, .price, .desc{
					display: inline-block;
					vertical-align: top;
				}
				.logo-wrapper{
					position: relative;
					top: -10px;
					margin: 0 12px;
					padding: 6px;
					width: 56px;
					height: 56px;
					box-sizing: border-box;
					border-radius: 50%;
					background-color: #141D27;
					// transition: all 0.4s;
					&.move_in_cart{
            animation: mymove .5s ease-in-out;
          }
					.logo{
						width: 100%;
						height: 100%;
						text-align: center;
						border-radius: 50%;
						background-color: #2B343C;
						&.highlight{
							background-color: #0389FF;
						}
						.icon-shopping_cart{
							line-height: 44px;
							font-size: 24px;
							color: #80858A;
							&.highlight{
								color: #FFF;
							}
						}
					}
					.num{
						position: absolute;
						top: 0;
						right: 0;
						width: 24px;
						height: 16px;
						line-height: 16px;
						text-align: center;
						border-radius: 16px;
						font-size: 9px;
						font-weight: 700;
						color: #FFF;
						background-color: rgb(240, 20, 20);
						box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
					}
				}
				.price{
					line-height: 24px;
					margin-top: 12px;
					padding-right: 12px;
					box-sizing: border-box;
					border-right: 1px solid rgba(255, 255, 255, 0.1);
					font-size: 16px;
					font-weight: 700;
					&.highlight{
						color: #FFF;
					}
				}
				.desc{
					line-height: 24px;
					margin: 12px 0 0 12px;
					font-size: .56rem;
				}
			}
			.content-right{
				flex: 0 0 100px;
				width: 100px;
				.pay{
					height: 48px;
					line-height: 48px;
					text-align: center;
					font-size: 12px;
					font-weight: 700;
					
					&.enough{
						color: #FFF;
						background-color: #00B43C;
					}
					&.not-enough{
						background-color: #2B333B;
					}
				}
			}
		}
		.ball-container{
			.ball{
				position: fixed;
				left: 32px;
				bottom: 22px;
				z-index: 200;
				transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
				.inner{
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background-color: rgb(0, 160, 220);
					transition: all 0.4s linear;
				}
			}
		}
		.shopcart-list{
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			transform: translate3d(0, -100%, 0);
			&.fold-enter-active,&.fold-leave-active{
				transition: all .5s;
			}
			&.fold-enter,&.fold-leave-active{
				transform: translate3d(0, 0, 0);
			}
			.list-header{
				height: 40px;
				line-height: 40px;
				padding: 0 18px;
				background-color: #F3F5F7;
				border-bottom: 1px solid rgba(7, 17, 27, .1);
				.title{
					float: left;
					font-size: 14px;
					color: rgb(7, 17, 27);
				}
				.empty{
					float: right;
					font-size: 12px;
					color: rgb(0, 160, 220);
				}
			}
			.list-content{
				padding-left: 18px;
				max-height: 217px;
				overflow: hidden;
				background-color: #FFF;
				.food{
					position: relative;
					padding: 12px 18px 12px 0;
					box-sizing: border-box;
					@include border-1px(rgba(7, 17, 27, .1));
					font-size: 14px;
					.name{
						line-height: 24px;
						font-size: 14px;
						color: rgb(7, 17, 27);
					}
					.price{
						position: absolute;
						right: 90px;
						bottom: 12px;
						line-height: 24px;
						font-size: 14px;
						font-weight: 700;
						color: rgb(240, 20, 20);
					}
					.cartcontrol-wrapper{
						position: absolute;
						right: 0;
						bottom: 6px;
					}
				}
			}
		}
	}
	.list-mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(7, 17, 27, .6);
		backdrop-filter: blur(10px);
		opacity: 1;
		z-index: 40;
		&.fade-enter,&.fade-leave-active{
			opacity: 0;
			background-color: rgba(7, 17, 27, 6);
		}
		&.fade-enter-active,&.fade-leave-active{
			transition: all .5s;
		}
	}
</style>