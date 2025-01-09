<template>
	<joy-page class="">
		<view class="body">
			<view class="top">
				<view class="space-between">
					<view class="company">
						<text class="name">{{ company.name || '暂无数据' }}</text>
						<text class="require">{{ company.industryName || '暂无数据' }} · {{ company.staffSize || '暂无数据' }}</text>
					</view>
					<image class="logo" :src="company.logo || '/static/img/company.png'"></image>
				</view>
			</view>
			<view class="time">
				<!-- 				<text class="title">福利待遇</text> -->
				<view class="require">
					<view class="item">
						<text class="yzb yzb-gongzuobao top-icon"></text>
						<text>{{ company.workTime }}</text>
					</view>
					<view class="item">
						<text class="yzb yzb-shoucang1 top-icon"></text>
						<text>{{ company.restTime }}</text>
					</view>
					<view class="item">
						<text class="yzb yzb-xueli top-icon"></text>
						<text>{{ company.workOvertime }}</text>
					</view>
				</view>
				<view class="welfare">
					<!-- 					<text class="items" v-for="(item, index) in company.welfare" :key="index" >{{item}}</text> -->
					<text class="items">社保</text>
					<text class="items">五险一金</text>
					<text class="items">节日福利</text>
				</view>
			</view>

			<view class="address">
				<text class="title">公司地址</text>
				<view class="space-between">
					<view class="column">
						<text class="info">{{ company.address || '暂无数据' }}</text>
					</view>
					<view class="nav" @click="toMap()">
						<text class="yzb yzb-daohang"></text>
						<text style="margin-left: 5upx">导航</text>
					</view>
				</view>
				<map v-if="longitude && latitude" :longitude="longitude" :latitude="latitude" :markers="markers" style="width: 100%; height: 300px" show-location></map>
			</view>
			<view class="detail">
				<text class="title">公司介绍</text>
				<view class="desc"
					><sunui-grand :content="company.introduce || '暂无数据'" color="#1D82FE" bg="#fff" :clamp="3" expandText="点击展开全文" shinkText="收起"></sunui-grand
				></view>
			</view>

			<view class="others">
				<text class="title">招聘岗位</text>
				<m-position v-if="positionList.length > 0" :positions="positionList" @click="positionDetail"></m-position>
				<view class="load-more-box">
					<uni-load-more v-if="status == '请求中'" status="正在加载..." :showIcon="true"></uni-load-more>
					<uni-load-more v-if="status == '没有更多'" status="没有更多了" :showIcon="false"></uni-load-more>
					<uni-load-more v-if="status == '暂无数据'" status="暂无数据" :showIcon="false"></uni-load-more>
					<uni-load-more v-if="status == '请求失败'" status="加载失败，点我重试" :showIcon="false" @click="reLoad"></uni-load-more>
				</view>
			</view>
		</view>
	</joy-page>
</template>

<script>
import sunUiGrand from '@/components/sunui-grand/sunui-grand.vue'
import { mapState, mapGetters } from 'vuex'
import mPosition from '@/components/m-position/m-position.vue'
const QQMapWX = require('../../common/qqmap-wx-jssdk.min.js') //腾讯地图

export default {
	components: {
		sunUiGrand,
	},
	computed: {
		...mapState(['userInfo']),
	},
	data() {
		return {
			company: {},
			status: '',
			query: {
				current: 1,
				pageSize: 10,
				id: null,
			},
			latitude: 39.909,
			longitude: 116.39742,
			positionList: [],
			markers: [],
			address: '',
			companyId: '',
		}
	},
	async onLoad(query) {
		// this.companyId = this.userInfo.companyId ? this.userInfo.companyId : query.id
		// console.log('this.userInfo', this.companyId)

		if (query.id) {
			this.companyId = query.id
			this.getCompanyInfo(query.id)
			// this.latitude = query.latitude
			// this.longitude = query.longitude
			// this.query.id = query.id
		} else {
			this.companyId = this.userInfo.companyId
			this.getCompanyInfo(this.userInfo.companyId)
		}
		// this.getCompanyJob()
		this.qqmapsdk = new QQMapWX({
			key: 'ZYHBZ-ERX3J-PWPFX-DXQDV-TQM23-VNB3Y',
		})
		this.reverseGeocode()
	},
	onReachBottom() {
		this.query.current++
		this.getCompanyJob()
	},
	methods: {
		reverseGeocode() {
			console.log('当前位置的地址信息：', this.latitude, this.longitude, this.address)
		},

		async getCompanyInfo(id) {
			let res = await this.$apis.getCompanyInfo(id)
			if (res) {
				this.company = res
				this.latitude = this.company.latitude
				this.longitude = this.company.longitude
				this.address = this.company.address
				console.log('当前位置的地址信息：', this.latitude, this.longitude, this.address)

				this.getCompanyJob()
			}
			this.markers = [
				{
					id: 1,
					latitude: this.latitude,
					longitude: this.longitude,
					title: this.address,
					width: 30, // 设置标记的宽度
					height: 40, // 设置标记的高度
					callout: {
						// 添加 callout 属性
						content: this.address,
						color: '#000',
						fontSize: 14,
						borderRadius: 5,
						bgColor: '#fff',
						padding: 10,
						display: 'ALWAYS',
					},
				},
			]
		},

		async getCompanyJob() {
			this.query.id = this.companyId
			this.status = '请求中'
			let res = await this.$apis.getCompanyJob(this.query)

			if (res) {
				let data = res.list
				for (let i in data) {
					if (data[i].skill) {
						data[i].skill = data[i].skill.split(',')
					}
				}
				this.positionList = this.positionList.concat(data || [])
				this.changeStatus(res)
			}
		},

		// 修改请求状态
		changeStatus(data) {
			if (this.positionList.length === 0) {
				this.status = '暂无数据'
			} else if (this.query.current >= Math.ceil(data.total / this.query.pageSize)) {
				this.status = '没有更多'
			} else {
				this.status = '请求更多'
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.space-between {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.center-align {
	display: flex;
	align-items: center;
}

.body {
	padding: 20upx;
	box-sizing: border-box;
	background-color: $bgcolor_white;
}

.top {
	padding: 30upx 0;
	.company {
		display: flex;
		flex-direction: column;
	}
	.name {
		font-size: $font-size-40;
		font-weight: bold;
		color: $font-color-000;
	}
	.logo {
		width: 150upx;
		height: 150upx;
		border: 1upx solid $border-color-base;
		border-radius: 10upx;
	}
	.require {
		font-size: $uni-font-size-base;
		margin-top: 15upx;
		color: $font-color-666;
	}
}

.time {
	display: flex;
	flex-direction: column;
	padding-bottom: 30upx;
	padding-top: 20upx;
	border-top: 1upx solid $border-color-base;
	.title {
		font-size: $uni-font-size-lg;
		font-weight: bold;
		padding: 30upx 0 20upx 0;
	}
	.require {
		display: flex;
		flex-direction: row;
		margin-top: 15upx;
		.item {
			margin-right: 30upx;
		}
		.top-icon {
			font-size: $font-lg;
			margin-right: 10upx;
		}
	}

	.welfare {
		display: flex;
		flex-direction: row;
		margin-top: 25upx;
		flex-wrap: wrap;
		.items {
			font-size: $uni-font-size-base;
			padding: 10upx 20upx;
			margin-right: 15upx;
			background-color: $border-color-base;
			border-radius: 5upx;
			color: $font-color-666;
			margin-top: 15upx;
		}
	}
}
.address {
	display: flex;
	flex-direction: column;
	padding-bottom: 30upx;
	border-top: 1upx solid $border-color-base;
	.title {
		font-size: $uni-font-size-lg;
		font-weight: bold;
		padding: 30upx 0 20upx 0;
	}
	.info {
		font-size: $uni-font-size-lg;
		padding: 10upx;
		line-height: 1.5;
	}
	.nav {
		width: 20%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border: 1upx solid $border-color-base;
		padding: 0upx 20upx;
		height: 70upx;
		border-radius: 35upx;
	}
}

.detail {
	display: flex;
	flex-direction: column;
	padding-bottom: 30upx;
	border-top: 1upx solid $border-color-base;
	.title {
		font-size: $uni-font-size-lg;
		font-weight: bold;
		padding: 30upx 0 0 0;
	}
	.desc {
		line-height: 1.8;
	}
	.skill {
		margin-top: 25upx;
		text {
			font-size: $uni-font-size-base;
			padding: 10upx 20upx;
			margin-right: 15upx;
			background-color: $border-color-base;
			border-radius: 5upx;
			color: $font-color-666;
		}
	}
}

.others {
	display: flex;
	flex-direction: column;
	margin-top: 30upx;
	border-top: 1upx solid $border-color-base;
	.title {
		font-size: $uni-font-size-lg;
		font-weight: bold;
		padding: 30upx 0;
	}
}
</style>
