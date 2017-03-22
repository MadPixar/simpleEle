<template>
  <div class="ratingselect">
  	<div class="rating-type border-1px">
  		<span class="block positive" 
  					:class="{current:selectType===2}"
  					@click="select(2,$event)" 
  					v-cloak
  		>{{desc.all}}<span class="count" v-cloak>{{ratings.length}}</span>
  		</span>
  		<span class="block positive" 
			  		:class="{current:selectType===0}" 
			  		@click="select(0,$event)"
			  		v-cloak
  		>{{desc.positive}}<span class="count" v-cloak>{{positive.length}}</span>
  		</span>
  		<span class="block negative" 
			  		:class="{current:selectType===1}" 
			  		@click="select(1,$event)"
			  		v-cloak
  		>{{desc.negative}}<span class="count" v-cloak>{{negative.length}}</span>
  		</span>
  	</div>
  	<div class="switch border-1px" @click="toggleContent" :class="{'on':onlyContent}">
  		<span class="icon-check_circle"></span>
  		<span class="text">只看有内容的评价</span>
  	</div>
  </div>
</template>

<script> // type="text/ecmascript-6"
	const POSITIVE = 0;  // 正向评价
	const NEGATIVE = 1;	 // 负向评价
	const ALL = 2;			 // 所有评价
	export default {
		name: 'Ratingselect',
		props: {
			ratings: {
				type: Array,
				default() {
					return [];
				}
			},
			selectType: {
				type: Number,
				default: ALL
			},
			onlyContent: {
				type: Boolean,
				default: false
			},
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					}
				}
			}
		},
		data() {
			return {
				// Vue2.0不能直接更改操作父元素的props，可以通过data的传值转换实现
				// 或者通过$emit通知到组件外,由父组件接收，然后在父组件内更改
				// selfType: this.selectType   这里通过创建副本实现转换后就可以用selfType去替换selectType了
			};
		},
		computed: {
			// 通过计算属性 去过滤出符合条件的评论
			// 在ratings数据中有一条rateType，0为正向评价，1为负向评价
			positive() {
				return this.ratings.filter(ratings => {
					return ratings.rateType === POSITIVE;
				})
			},
			negative() {
				return this.ratings.filter(ratings => {
					return ratings.rateType === NEGATIVE;
				})
			}
			// console.log(positive) 通过打印positive或者negative 可以看出为一个数组
		},
		methods: {
			select(type, event) {
				if (!event._constructed) return;
				// this.selfType = type;     给副本赋值就能实现效果
				this.$emit('select',type)
			},
			toggleContent(e) {
				if (!e._constructed) return;
				this.$emit('toggle');
			}
		}
	}
</script>

<style lang="scss" scoped>
  @import '../../common/scss/mixin';

	.ratingselect{
		.rating-type{
			padding: 18px 0;
			margin: 0 18px;
			font-size: 0;
			@include border-1px(rgba(7, 17, 27,0.1));
			.block{
				display: inline-block;
				padding: 8px 12px;
				margin-right: 8px;
				border-radius: 2px;
				line-height: 16px;
				font-size: 12px;
				color: rgb(77, 85, 93);
				&.positive{
					background-color: rgba(3, 152, 255, 0.2);
					&.current{
						color: #FFF;
						background-color: rgb(3, 152, 255);
					}
				}
				&.negative{
					background-color: rgba(77, 85, 93, 0.2);
					&.current{
						color: #FFF;
						background-color: rgb(77, 85, 93);
					}
				}
				.count{
					font-size: 8px;
					margin-left: 2px;
				}
			}
		}
		.switch{
			padding: 12px 18px;
			line-height: 24px;
			@include border-1px(rgba(7, 17, 27, 0.1));
			color: rgb(147, 153, 159);
			font-size: 0;
			&.on>.icon-check_circle{
				color: #00C850;
			}
			&>span{
				display: inline-block;
				vertical-align: middle;
			}
			&>.icon-check_circle{
				font-size: 24px;
				margin-right: 4px;
			}
			&>.text{
				font-size: 12px;
			}
		}
	}
</style>