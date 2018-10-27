(function (window,Vue,undefined) {
	new Vue({
		el:'#app',
		data: {
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || [],
			newTodo: '',
			beforeUpdate: {},
			activeBtn: 1,
			showArr: [],
		},
		methods: {
			//添加数据
			addTodo() {
				if (!this.newTodo.trim()) return;
				this.dataList.push({
					content: this.newTodo.trim(),
					isFinish: false,
					id:this.dataList.length?this.dataList.sort((a,b) => {a.id - b.id})[this.dataList.length - 1].id + 1 : 1
				})
				this.newTodo = '';
			},
			//删除数据
			delTodo(index) {
				this.dataList.splice(index, 1);
			},
			//删除所有选中项
			delAll() {
				this.dataList = this.dataList.filter(item => !item.isFinish)
			},
			//双击显示文本框
			showEdit(index) {
				this.$refs.edit.forEach(item => item.classList.remove('editing'));
				this.$refs.edit[index].classList.add('editing');
				this.beforeUpdate = JSON.parse(JSON.stringify(this.dataList[index]));
			},
			//编辑
			updateTodo(index) {
				if (!this.dataList[index].content.trim()) return this.dataList.splice(index, 1);
				if (this.dataList[index].content !== this.beforeUpdate.content) this.dataList[index].isFinish = false;
				this.$refs.edit[index].classList.remove('editing');
				this.beforeUpdate = {};
			},
			//还原内容
			backTodo(index) {
				this.dataList[index].content = this.beforeUpdate.content;
				this.$refs.edit[index].classList.remove('editing');
				this.beforeUpdate = {};
			},
			//hashchange 事件
			hashchange() {
				// console.log(window.location.hash);
				switch(window.location.hash) {
					case '':
					case '#/':
						this.showAll();
						this.activeBtn = 1;
						break
					case '#/active':
						this.activeAll(false);
						this.activeBtn = 2;
						break
					case '#/completed':
						this.activeAll(true);
						this.activeBtn = 3;
						break
				}
			},
			//创建一个显示的数组
			showAll() {
				this.showArr = this.dataList.map(() => true);
				// console.log(this.showArr);
			},
			activeAll(boo) {
				this.showArr = this.dataList.map(item => item.isFinish === boo);
				if (boo && this.dataList.every(item => item.isFinish === !boo)) window.location.hash = '#/';
				if (!boo && this.dataList.every(item => item.isFinish === !boo)) window.location.hash = '#/';
			},
		},
		//监听
		watch: {
			dataList: {
				handler(newArr) {
					window.localStorage.setItem('dataList', JSON.stringify(newArr));
					this.hashchange();
				},
				deep: true
			}
		},
		//计算属性
		computed: {
			activeNum() {
				return this.dataList.filter(item => item.isFinish === false).length;
			},

			toggleAll: {
				get() {
					return this.dataList.every(item => item.isFinish);
				},
				set(val) {
					this.dataList.forEach(item => item.isFinish = val);
				}
			}
		},
		//自定义指令
		directives: {
			focus:{
				inserted(el) {
					el.focus();
				}
			}
		},
		//声明周期
		created() {
			this.showAll();
			this.hashchange();
			window.onhashchange = () => {
				this.hashchange();
			}
		}
	})

})(window,Vue);
