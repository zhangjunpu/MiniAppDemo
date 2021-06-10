// components/p-sel/p-sel.js
Component({
	data: {
		count: 0
	},
	methods: {
		countPlus(num) {
			this.setData({
				count: this.data.count + num
			})
		}
	}
})
