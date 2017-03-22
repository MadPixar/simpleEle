<template>
  <div class="header">
  	<div class="content-wrapper">
  		<div class="avatar">
  			<img :src="seller.avatar" width="64" height="64">
  		</div>
  		<div class="content">
  			<div class="title">
  				<span class="brand"></span>
  				<span class="name" v-cloak>{{seller.name}}</span>
  			</div>
				<div class="description" v-cloak>
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<div class="support" v-if="seller.supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text" v-cloak>{{seller.supports[0].description}}</span>
				</div>
  		</div>
  		<div class="support-count" v-if="seller.supports" @click="showDetail">
  			<span class="count" v-cloak>{{seller.supports.length}}个</span>
  			<i class="icon-keyboard_arrow_right"></i>
  		</div>
  	</div>
  	<div class="bulletin-wrapper" @click="showDetail">	
  		<span class="bulletin-title"></span><span class="bulletin-text" v-cloak>{{seller.bulletin}}</span>
  		<i class="icon-keyboard_arrow_right"></i>
  	</div>
  	<div class="background">
  		<img :src="seller.avatar" width="100%" >
  	</div>
  	<transition name="fade">
  		<div class="detail" v-show="detailShow">
	  		<div class="detail-wrapper clearfix">
	  			<div class="detail-main">
	  				<h1 class="name" v-cloak>{{seller.name}}</h1>
	  				<div class="star-wrapper">
	  					<Star :size="48" :score="seller.score"></Star>
	  				</div>
	  				<div class="title">
	  					<div class="line"></div>
	  					<div class="text">优惠信息</div>
	  					<div class="line"></div>
	  				</div>
	  				<ul v-if="seller.supports" class="supports">
	  					<li class="supports-item" v-for="(item,index) in seller.supports">
	  						<span class="icon" :class="classMap[seller.supports[index].type]" ></span>
	  						<span class="text" v-cloak>{{seller.supports[index].description}}</span>
	  					</li>
	  				</ul>
	  				<div class="title">
	  					<div class="line"></div>
	  					<div class="text">商家公告</div>
	  					<div class="line"></div>
	  				</div>
	  				<div class="bulletin">
	  					<p class="content" v-cloak>{{seller.bulletin}}</p>
	  				</div>
	  			</div>
	  		</div>
	  		<div class="detail-close">
	  			<i class="icon-close" @click="hideDetail"></i>
	  		</div>
	  	</div>
  	</transition>
  </div>
</template>

<script>
	import Star from 'components/star/Star'
	// 在引入了组件后记得注册才能使用，component{}

  export default{
    name: 'header',
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false
      }
    },
    methods: {
    	banScroll(e) {
        	e.preventDefault();
      },
      showDetail() {
        this.detailShow = true;
        addEventListener('touchmove', this.banScroll, false);
      },
      hideDetail() {
      	this.detailShow = !this.detailShow;
      	removeEventListener('touchmove', this.banScroll, false);
      }
      
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      // 这个classMap对应的json supports下面的五种活动的type[0-4]，然后绑定对应的class引入不同的图片，所以定义出一个数组用于引用
    },
    components: {
      Star
    }
  }
</script>

<style lang="scss" scoped>
@import '../../common/scss/mixin';
	.header{
		position: relative;
		color: #FFF;
		background-color: rgba(1, 17, 27, 0.5);
		overflow: hidden;
		.content-wrapper{
			position: relative;
			padding: 24px 12px 18px 24px;
			font-size: 0;
		}
		.avatar{
			display: inline-block;
			vertical-align: top;
			img{
				border-radius: 6px;
			}
		}
		.content{
			display: inline-block;
			margin-left: 16px;
			.title{
				margin: 2px 0 8px 0;
			}
			.brand{
				display: inline-block;
				width: 30px;
				height: 18px;
				@include bg-image('images/brand');
				background-size: 30px 18px;
				background-repeat: no-repeat;
				vertical-align: top;
			}
			.name{
				margin-left: 6px;
				font-size: 16px;
				line-height: 18px;
				font-weight: bold; 
			}
			.description{
				margin-bottom: 10px;
				line-height: 12px;
				font-size: 12px;
			}
			.support{
				.icon{
					display: inline-block;
					width: 12px;
					height: 12px;
					margin-right: 4px;
					background-size: 12px;
					background-repeat: no-repeat;
					vertical-align: top;
					&.decrease{
						@include bg-image('images/decrease_1')
					}
					&.discount{
						@include bg-image('images/discount_1')
					}
					&.guarantee{
						@include bg-image('images/guarantee_1')
					}
					&.invoice{
						@include bg-image('images/invoice_1')
					}
					&.special{
						@include bg-image('images/special_1')
					}
				}
				.text{
					font-size: 10px;
					line-height: 12px;
				}
			}
			
		}
		.support-count{
			position: absolute;
			right: 12px;
			bottom: 16px;
			padding: 0 8px;
			height: 24px;
			line-height: 24px;
			border-radius: 14px;
			background-color: rgba(0, 0, 0, 0.2);
			text-align: center;
			.count,.icon-keyboard_arrow_right{
				line-height: 24px;
				margin-left: 2px;
			}
			.count{
				vertical-align: top;
				font-size: 10px;
				margin-right: -2px;
			}
			.icon-keyboard_arrow_right{
				font-size: 12px;
			}
		}
		.bulletin-wrapper{
			position: relative;
			height: 28px;
			line-height: 28px;
			padding: 0 22px 0 12px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			background-color: rgba(7, 17, 87, 0.2);
			.bulletin-title{
				display: inline-block;
				width: 22px;
				height: 12px;
				@include bg-image('images/bulletin')
				background-size: 22px 12px;
				background-repeat: no-repeat;
				margin-top: -1px;
			}
			.bulletin-text{
				font-size: 10px;
				font-weight: 200;
				margin: 0 4px;
			}
			.bulletin-title,.bulletin-text{
				vertical-align: middle;
			}
			.icon-keyboard_arrow_right{
				position: absolute;
				font-size: 12px;
				top: 8px;
				right: 12px;
			}
		}
		.background{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			filter: blur(10px);
		}
		.detail{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			height: 100%;
			overflow: auto;
			background-color: rgba(7, 17, 27, 0.8);
			backdrop-filter: blur(10px);
			&.fade-enter-active, &.fade-leave-active{
        transition: all 0.5s;
      }
      &.fade-enter, &.fade-leave-active{
        opacity: 0;
        background: rgba(7, 17, 27, 0);
      }
      // &.silde-enter-active, &.silde-leave-active{
      //   transition: all 0.5s;
      // }
      // &.silde-enter, &.silde-leave-active{
      //   opacity: 0;
      //   background: rgba(7, 17, 27, 0);
      // }
			.detail-wrapper{
				width: 100%;
				min-height: 100%;
				.detail-main{
					margin-top: 64px;
					padding-bottom: 64px;
					.name{
						font-size: 16px;
						line-height: 16px;
						font-weight: 700;
						text-align: center;
					}
					.star-wrapper{
						margin-top: 18px;
						padding: 2px 0;
						text-align: center;
					}
					.title{
						display: flex;
						width: 80%;
						margin: 24px auto;
						.line{
							flex: 1;
							position: relative;
							top: -6px;
							border-bottom: 1px solid rgba(255, 255, 255, 0.2);
						}
						.text{
							padding: 0 12px;
							font-size: 14px;
							font-weight: 700;
						}
					}
					.supports{
						width: 80%;
						margin: 0 auto;
						.supports-item{
							padding: 0 12px;
							margin-bottom: 12px;
							font-size: 0;
							&:last-child{
								margin-bottom: 0;
							}
							.icon{
								display: inline-block;
								width: 16px;
								height: 16px;
								vertical-align: top;
								margin-right: 6px;
								background-size: 16px 16px;
								background-repeat: no-repeat;
								&.decrease{
									@include bg-image('images/decrease_2')
								}
								&.discount{
									@include bg-image('images/discount_2')
								}
								&.guarantee{
									@include bg-image('images/guarantee_2')
								}
								&.invoice{
									@include bg-image('images/invoice_2')
								}
								&.special{
									@include bg-image('images/special_2')
								}
							}
							.text{
								line-height: 16px;
								font-size: 12px;
							}
						}
					}
					.bulletin{
						width: 80%;
						margin: 0 auto;
						.content{
							padding: 0 12px;
							margin-left: 0;
							line-height: 24px;
							font-size: 12px;
							text-align: justify;
						}
					}
				}
			}
			.detail-close{
				position: relative;
				width: 32px;
				height: 32px;
				margin: -64px auto 0;
				clear: both;
				font-size: 32px;
			}
		}
	}
</style>
