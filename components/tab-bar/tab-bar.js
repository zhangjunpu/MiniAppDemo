// components/tab-bar/tab-bar.js
Component({
	properties: {
		titles: {
			type: Array,
			value: []
		}
	},
	data: {
		curIndex: 0
	},
	methods: {
		onTabItemClick(event) {
			// console.log(this.dataset.index);
			const index = event.currentTarget.dataset.index
			const item = event.currentTarget.dataset.item
			this.triggerEvent("tabtap", { index, "title": item })
			this.setData({
				curIndex: index
			})
		}
	}
})
