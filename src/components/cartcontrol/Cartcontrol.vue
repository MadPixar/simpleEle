<template>
  <div class="cartcontrol">
  	<transition name="move">
  		<div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart">
  		</div>
  	</transition>
  	<div class="cart-count" v-show="food.count>0" v-cloak>{{food.count}}</div>
  	<div class="cart-increase icon-add_circle" @click.stop.prevent="increaseCart"></div>
  </div>
</template>

<script> // type="text/ecmascript-6"
import Vue from 'vue';

	export default {
		name: 'Cartcontrol',
		data() {
			return {
				a: 0,
				indexCount: []
			};
		},
		props: {
			food: {
				type: Object
			},
			index: {
				type: Number
			}
		},
		created() {
			// console.log(this.food);
			for (let i = 0; i < this.length ; i++) {
				this.indexCount.push(0);
			}
			// console.log(JSON.stringify(this.indexCount));
		},
		methods: {
			increaseCart(event) {
				if (!event._constructed) return; 
				if (!this.food.count) {
					// this.food.count = 1;
					Vue.set(this.food, 'count', 1);
					Vue.set(this.food, 'index', this.index);	// 添加index属性用于分类计算商品数
					// 设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。这个方法主要用于避开 Vue 不能检测属性被添加的限制。

				} else {
					this.food.count++;
				}
				this.$emit('add', event.target); 
				// 把点击小球事件派发出去，最好是引入Vuex来管理状态，一旦数据流庞大复杂，就会导致逻辑不清晰。
			},
			decreaseCart(event){
				if (!event._constructed) return;
				if (this.food.count > 0) {
					this.food.count--;
				} else if (this.food.count = 0) {

				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.cartcontrol{
		font-size: 0;
		.cart-decrease, .cart-count, .cart-increase{
			display: inline-block;
		}
		.cart-decrease, .cart-increase{
			padding: 6px;
			line-height: 24px;
			font-size: 24px;
			color: rgb(3, 152, 255);
		}
		.cart-decrease{
			opacity: 1;
      transform: translate3d(0, 0, 0) rotate(0deg);
      &.move-enter-active, &.move-leave-active{
        transition: all 0.4s linear
      }
      &.move-enter, &.move-leave-active{
        opacity: 0;
        transform: translate3d(24px, 0, 0) rotate(180deg);
      }
		}
		.cart-count{
			vertical-align: top;
			width: 14px;
			padding-top: 6px;
			line-height: 24px;
			text-align: center;
			font-size: 10px;
			color: rgb(147, 153, 159);
		}
	}
</style>