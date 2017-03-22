<template>
  <div class="num" v-show="iCount[index]>0" v-cloak>{{iCount[index]}}</div>
</template>

<script> // type="text/ecmascript-6"
	export default {
		name: 'Menucount',
		data() {
			return {
				indexCount: []
			};
		},
		props: {
			selectFoods: {
				type: Array,
				default() {
					return [];
				}
			},
			index: {
				type: Number
			},
			length: {
				type: Number
			}
		},
		created() {
			// 算出分类商品数的数组长度
			for (let i = 0; i < this.length ; i++) {
				this.indexCount.push(0);
			}
		},
		computed: {
			iCount() {
				let count = 0;
				let iCountArr = [];
				this.selectFoods.forEach( food => {
					if (food.index === this.index) {		// 当列表栏index 和商品栏 index相同时分类相加
						count += food.count;
						this.indexCount[this.index] = count;
						iCountArr = this.indexCount
						// console.log(JSON.stringify(iCountArr));
					}
				});
				return iCountArr;
			}
		}
	}
</script>

<style lang="scss" scoped>
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
</style>