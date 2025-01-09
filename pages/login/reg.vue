<template>
	<view class="container">
		<!-- <view class="left-bottom-sign"></view> -->
		<!-- <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view> -->
		<!-- <view class="right-top-sign"></view> -->
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign"><!-- FORGET --></view>
			<view class="welcome"><!-- 找回密码 --></view>
			<view class="input-content">
				<view class="input-item">
					<!-- <text class="tit">手机号码</text> -->
					<input type="text" maxlength="11" v-model="username" placeholder="请输入用户姓名" />
				</view>
				<!-- <view class="input-item">
					<input type="number" maxlength="11" v-model="mobile" placeholder="请输入手机号码" />
				</view> -->
				<view class="input-item">
					<!-- <text class="tit">密码</text> -->
					<input type="password" placeholder="请输入密码" v-model="password" />
				</view>
				<!-- <view class="input-item">
					<input type="password" placeholder="请再次确认密码" v-model="passwords" @confirm="toLogin" />
				</view> -->
				<!-- <view class="input-item">
					<view class="input-item-right">
						<input type="number" maxlength="6" placeholder="请输入验证码" v-model="code" @confirm="toLogin" style="width: 70%" />
						<view class="codeText" v-if="coding == false" @click="getCode()">获取验证码</view>
						<view class="authTime" v-else>{{ auth_time }}秒</view>
					</view>
				</view> -->
			</view>
			<button class="confirm-btn" @click="toforget">完成</button>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
	computed: {
		...mapState(['userInfo']),
		...mapGetters(['hasLogin']),
	},
	data() {
		return {
			username: '',
			mobile: '',
			password: '',
			passwords: '',
			code: '',

			coding: false,
			auth_time: 60,
		}
	},
	// onLoad() {
	// 	this.phone = this.userInfo.mobile
	// },
	computed: {
		...mapState(['hasLogin', 'userInfo']),
	},
	methods: {
		...mapMutations(['login']),
		inputChange(e) {
			const key = e.currentTarget.dataset.key
			this[key] = e.detail.value
		},
		navBack() {
			uni.navigateBack({ delta: 1 })
			// uni.switchTab({ url: '/pages/index/index' });
		},
		/**
		 * 重置密码
		 */
		async toforget() {
			console.log('----', this.username, this.password)

			uni.showLoading({ mask: false })
			let params = { username: this.username, password: this.password }
			let res = await this.$apis.login(params)
			if (res) {
				console.log('--------', res)

				this.$store.commit('SET_USERINFO', res || {})
				// 前端自动登录
				this.$store.commit('SET_TOKEN', res.token)
				console.log('addBrowse success !!!')
				uni.showToast({ title: '登录成功' })
				setTimeout(function () {
					uni.navigateBack({ delta: 2 })
				}, 1200)
			}
			uni.hideLoading()
		},

		/**
		 * 获取验证码
		 */
		async getCode() {
			// 判断手机号格式是否正确
			var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
			if (!myreg.test(this.phone)) {
				uni.showToast({
					icon: 'none',
					title: '请输入正确的手机号码',
				})
				return false
			}
			if (this.password != this.passwords) {
				uni.showToast({
					icon: 'none',
					title: '两次密码不一致',
				})
				return false
			}
			//设置倒计时秒
			this.auth_time = 60
			this.coding = true
			var auth_timetimer = setInterval(() => {
				this.auth_time--
				if (this.auth_time < 0) {
					this.coding = false
					clearInterval(auth_timetimer)
				}
			}, 1000)
			//获取验证码
			let params = { phone: this.phone }
			let data = await this.$apis.getVerifyCode(params)
			console.log('getVerCode===', data)
			if (data) {
				uni.showToast({ title: '获取成功' })
			} else {
				uni.showToast({ title: '获取失败,请重试', icon: 'none' })
			}
		},
	},
}
</script>

<style lang="scss">
page {
	background: #fff;
}
.container {
	padding-top: 95upx;
	position: relative;
	width: 100vw;
	// height: 100vh;
	overflow: hidden;
	background: #fff;
}
.wrapper {
	position: relative;
	z-index: 90;
	background: #fff;
	padding-bottom: 40upx;
}
.input-item-right {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	justify-content: space-between;
}
.codeText {
	font-size: 28upx;
	width: 25%;
	display: flex;
	align-items: center;
	justify-content: center;
	// color: #fa436a;
	color: $main-color;
}
.authTime {
	font-size: 28upx;
	width: 25%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fa436a;
}
.back-btn {
	position: absolute;
	left: 40upx;
	z-index: 9999;
	padding-top: var(--status-bar-height);
	// top: 40upx;
	top: 20upx;
	font-size: 40upx;
	color: $font-color-dark;
}
.left-top-sign {
	font-size: 120upx;
	color: $page-color-base;
	position: relative;
	left: -16upx;
}
.right-top-sign {
	position: absolute;
	top: 80upx;
	right: -30upx;
	z-index: 95;
	&:before,
	&:after {
		display: block;
		content: '';
		width: 400upx;
		height: 80upx;
		background: #b4f3e2;
	}
	&:before {
		transform: rotate(50deg);
		border-radius: 0 50px 0 0;
	}
	&:after {
		position: absolute;
		right: -198upx;
		top: 0;
		transform: rotate(-50deg);
		border-radius: 50px 0 0 0;
		/* background: pink; */
	}
}
.left-bottom-sign {
	position: absolute;
	left: -270upx;
	bottom: -320upx;
	border: 100upx solid #d0d1fd;
	border-radius: 50%;
	padding: 180upx;
}
.welcome {
	position: relative;
	left: 50upx;
	top: -90upx;
	font-size: 46upx;
	color: #555;
	text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}
.input-content {
	padding: 0 60upx;
}
.input-item {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding: 0 30upx;
	background: $page-color-light;
	// height: 120upx;
	height: 90upx;
	border-radius: 50upx;
	// border-radius: 4px;
	margin-bottom: 50upx;
	&:last-child {
		margin-bottom: 0;
	}
	.tit {
		height: 50upx;
		line-height: 56upx;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
	}
	input {
		height: 60upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		width: 100%;
	}
}

.confirm-btn {
	width: 630upx;
	// height: 76upx;
	height: 90upx;
	line-height: 90upx;
	border-radius: 50px;
	margin-top: 70upx;
	background-color: $main-color;
	// background: $uni-color-primary;
	color: #fff;
	font-size: $font-lg;
	&:after {
		border-radius: 100px;
	}
}
.forget-section {
	font-size: $font-sm + 2upx;
	color: $font-color-spec;
	text-align: center;
	margin-top: 40upx;
}
.register-section {
	position: absolute;
	left: 0;
	bottom: 50upx;
	width: 100%;
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	text-align: center;
	text {
		color: $font-color-spec;
		margin-left: 10upx;
	}
}
</style>
