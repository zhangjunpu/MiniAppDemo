// components/p-cpn/p-cpn.js
Component({
	options: {
		styleIsolation: "isolated"
	}, 

	properties: {
		title: {
			type: String,
			value: "默认标题",
			observer: function (newVal, oldVal) {
				console.log("observer title: ", newVal, oldVal);
			}
		},
		desc: String
	},
	
	externalClasses: ["titleclass"]
})
