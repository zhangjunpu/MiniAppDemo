// components/p-slot/p-slot.js
Component({
	options: {
		multipleSlots: true
	},
	properties: {
		imagesrc: String
	},
	created() {
		console.log("created");
	},
	lifetimes: {
		created() {
			console.log('life created')
		},
		attached() {
			console.log('life attached');
		},
		ready() {
			console.log('life ready');
		},
		moved() {
			console.log('life moved');
		},
		detached() {
			console.log('life detached');
		}
	},
	pageLifetimes: {
		show() {
			console.log('page life show');
		},
		hide() {
			console.log('page life hide');
		},
		resize() {
			console.log('page life resize');
		}
	}
})
