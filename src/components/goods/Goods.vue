<template>
  <div class="goods">
  	<div class="menu-wrapper" ref="menuWrapper">
  		<ul class="menu-ul">
  			<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
  				<span class="text border-1px" v-cloak>
  					<span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
  				</span>
  				<!-- <div class="num" v-show="count[index]>0&&currentIndex===index" v-cloak>{{count[index]}}</div> -->
  				<Menucount :index="index" :selectFoods="selectFoods" :length="goods.length"></Menucount>
  			</li>
  		</ul>
  	</div>
  	<div class="foods-wrapper" ref="foodsWrapper">
  		<ul>
  			<li v-for="(item,index) in goods" class="food-list" ref="foodList">
  				<h1 class="title" v-cloak>{{item.name}}</h1>
  				<ul>
  					<li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food, $event)">
  						<div class="icon">
  							<img :src="food.icon" >
  						</div>
  						<div class="content">
  							<h2 class="name">{{food.name}}</h2>
  							<p class="desc">{{food.description}}</p>
  							<div class="extra">
  								<span class="count">月售{{food.sellCount}}份</span>
  								<span>好评率{{food.rating}}%</span>
  							</div>
  							<div class="price">
  								<span class="now">¥{{food.price}}</span>
  								<span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
  							</div>
  							<div class="cartcontrol-wrapper">
  								<Cartcontrol @add="addFood" :food="food" :index="index"></Cartcontrol>
  							</div>
  						</div>
  					</li>
  				</ul>
  			</li>
  		</ul>
  	</div>
  	<Shopcart
  		ref="shopcart" 
  		:selectFoods="selectFoods" 
  		:deliveryPrice="seller.deliveryPrice" 
  		:minPrice="seller.minPrice">
  	</Shopcart>
  	<!-- 将这两个数据 传入到Shopcart组件 -->
  	<Food @add="addFood" :food="selectedFood" ref="food"></Food>
  </div>
</template>

<script>
	import BScroll from 'better-scroll';
	import Shopcart from 'components/shopcart/Shopcart';
	import Cartcontrol from 'components/cartcontrol/Cartcontrol';
	import Menucount from 'components/menucount/Menucount';
	import Food from 'components/food/Food';
	const ERROR_OK = 0;

	export default{
	  name: 'Goods',
	  props: {
	  	seller: {
	  		type: Object
	  	}
	  },
	  data() {
	  	return {
	  		currentIndex: 0,
	  		goods: [],
	  		menuIndexChange: true,    // 解决选中index时，scroll监听事件重复判断设置index的bug
	  		listHeight: ['0'],
	  		scrollY: 0,
	  		selectedFood: {}					  // 传递给商品详情的数据
	  	};
	  },
	  computed: {
	  	// currentIndex() {
	  		
	  			// for(let i = 0; i < this.listHeight.length; i++) {
		  		// 	let height1 = this.listHeight[i];
		  		// 	let height2 = this.listHeight[i+1];
		  		// 	//若果i是最后一个 那么i+1就不存在 所以要判断一下是否为最后一个
		  		// 	if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
		  		// 		console.log(i);
		  		// 		return i;
		  		// 	}
		  		// }
		  		// return 0
		  		// let arr = [];
		 	  //   this.listHeight.forEach((item, index) => {
		    //     if (this.menuIndexChange && this.scrollY >= item) {
		    //     	let i = arr.push(index);
		        	
		    //     	console.log(i);
		    //       return i;
		    //     }
		    //   })
	  	// }
	  	selectFoods() {
				let foods = [];
				this.goods.forEach(good => {
					good.foods.forEach(food => {
						if (food.count) {
							foods.push(food);
						}
					});
				});
				// console.log(JSON.stringify(foods));
				return foods;
			}
	  },
	  created() {
	  	this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

	  	this.$http.get('/api/goods').then(res =>{
	  		return res.json();
	  	}).then(json => {
	  		if(json.errno === ERROR_OK) {
	  			this.goods = json.data;
	  			// console.log(this.goods) 
	  			this.$nextTick(() => {
	  				this._initScroll();
	  				this._calculateHeight();
	  			})
	  			
	  		}
	  	})
	  },
	  methods: {
	  	selectMenu(index, event) {
	  		if (!event._constructed) {
          return;
        }
        /*
        在移动端的点击没问题，但在pc端会出发两次，是因为BS屏蔽了移动端默认事件，然后在click为true的情况下会去自己给派发点击事件，这样就给pc端的点击重复触发，所以在pc端的话，它是没有event._constructed这个属性的，我们把pc端的事件return掉，就不会重复触发了
        */
        let foodList = this.$refs.foodList;
        let el = foodList[index];
        // addClass(cla('menu-item')[index],'current');
        this.scrollY = this.listHeight[index];
        this.currentIndex = index;
        this.menuIndexChange = false;
        this.foodsScroll.scrollToElement(el, 300);
        // this.menuIndexChange = true;
        // console.log(this.currentIndex+'|'+index);
	  	},
	  	selectFood(food, event) {
	  		if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();     //执行food组件的show()方法将food详情页显示
	  	},
	  	_initScroll() {
	  		this.menuScroll = new BScroll(this.$refs.menuWrapper,{
	  			click: true    // 添加监听，better-scroll屏蔽一些点击的默认的事件
	  		});
	  		this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
	  			click: true,
	  			probeType: 3   // 为3时 不论缓动滚动还是延时滚动 都能实时监听位置
	  		});

	  		this.foodsScroll.on('scroll', (pos) => {
	  			this.scrollY = Math.abs(Math.round(pos.y)); 
	  			// console.log('scrollY的值为'+this.scrollY);
	  			// pos.y 取到position的y轴的滚动值 取整再取绝对
	  			this.scrollIndex();
	  		});
	  		this.$refs.foodsWrapper.addEventListener('touchmove', () => {this.menuIndexChange = true;})
	  	},
	  	_calculateHeight() {
	  		// let liHeight = cla('food-list');
	  		let liHeight = this.$refs.foodList;
	  		let height = 0;
	  		// console.log(liHeight[0].clientHeight);
	  		// 如果你不想用vue自带的$ref属性去获取dom节点那么你就可以用原生的方法去获取
	  		for(let i=0; i < liHeight.length; i++) {
	  			height += liHeight[i].clientHeight;
	  			this.listHeight.push(height);
	  			// console.log(height)
	  		}
	  	},
	  	scrollIndex() {
	  		this.listHeight.forEach((item, index) => {
          if (this.menuIndexChange && this.scrollY >= item) {
          	// console.log(index);
            this.currentIndex = index;
          }
        })
	  	},
	  	addFood(target) {
        this._drop(target);
      },
      _drop(target) {
      	// 在开启第一次小球动画时会有卡顿，可能是因为第一次点击要执行多个动画导致，
      	// 所以我们把_drop调用子组件动画异步执行来优化体验，在DOM更新后执行
      	this.$nextTick(() => {
      		this.$refs.shopcart.drop(target);
      	});
      }
	  },
	  components: {
	  	Shopcart,
	  	Cartcontrol,
	  	Menucount,
	  	Food
	  }
	}

</script>

<style lang="scss" scoped>
@import '../../common/scss/mixin';
	.goods{
		display: flex;
		position: absolute;
		top: 174px;
		// bottom: 46px;
		bottom: 0;
		width: 100%;
		overflow: hidden;
		.menu-wrapper{
			flex: 0 0 80px;
			width: 80px;
			background-color: #F3F5F7;
			margin-bottom: 46px;
			.menu-ul{
				padding-bottom: 40px;
			}
			.menu-item{
				position: relative;
				display: table;
				// height: 58px;
				width: 56px;
				line-height: 16px;
				padding: 16px 12px 0;
				// text-align: center;
				&.current{
					position: relative;
					margin-top: -1px;
					z-index: 10;
					background-color: #FFF;
					&:after{
						position: absolute;
						top: 0;
						left: 0;
						height: 100%;
						border-left: 3px solid #0389FF;
						content:'';
					}
					.text{
						font-weight: 700;
						@include border-none();
					}
				}
				.icon{
					display: inline-block;
					width: 12px;
					height: 12px;
					margin-right: 2px;
					background-size: 12px;
					background-repeat: no-repeat;
					vertical-align: top;
					&.decrease{
						@include bg-image('images/decrease_3')
					}
					&.discount{
						@include bg-image('images/discount_3')
					}
					&.guarantee{
						@include bg-image('images/guarantee_3')
					}
					&.invoice{
						@include bg-image('images/invoice_3')
					}
					&.special{
						@include bg-image('images/special_3')
					}
				}
				.text{
					font-size: 12px;
					display: table-cell;
					width: 56px;
					vertical-align: middle;
					padding-bottom: 16px;
					@include border-1px(rgba(7, 17, 87, 0.1));
				}
				.num{
					position: absolute;
					top: 4px;
					right: 4px;
					// width: 16px;
					height: 10px;
					line-height: 10px;
					padding: 0 4px;
					text-align: center;
					border-radius: 16px;
					font-size: 9px;
					font-weight: 700;
					color: #FFF;
					background-color: rgb(240, 20, 20);
				}
			}
		}
		.foods-wrapper{
			margin-bottom: 46px;
			flex: 1;
			.title{
				padding-left: 14px;
				height: 26px;
				line-height: 26px;
				border-left: 2px solid #D9DDE1;
				font-size: 12px;
				color: rgb(147, 153, 159);
				background-color: #F3F5F7;
			}
			.food-item{
				display: flex;
				padding: 18px;
				@include border-1px(rgba(7, 17, 27, 0.1));
				&:last-child{
					@include border-none();
				}
				.icon{
					width: 57px;
					height: 57px;
					flex: 0 0 57px;
					margin-right: 10px;
					overflow: hidden;
					&>img{
						width:57px
					}
				}
				.content{
					flex: 1;
					.name{
						margin: 2px 0 8px 0;
						height: 14px;
						line-height: 14px;
						font-size: 14px;
						color: rgb(7, 17, 27);
					}
					.desc, .extra{
						font-size: 10px;
						color: rgb(147, 153, 159);
					}
					.desc{
						line-height: 14px;
						margin-bottom: 8px;
					}
					.extra{
						line-height: 10px;
						.count{
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
					.cartcontrol-wrapper{
						position: absolute;
						right: 16px;
						bottom: 8px;
					}
				}
			}
		}
	}
</style>