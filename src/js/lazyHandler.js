_require.define('lazyHandler', function() {
	class Handler {
		constructor() {
			//队列函数
			this.handlers = [];
			//是否还有函数在执行
			this.isRun = true;
		}
		//添加任务进队列
		add(fn, args, ctx) {
			fn.args = args;
			fn.ctx = ctx;
			this.handlers.push(fn);
			this.run();
		}
		//运行任务
		run() {
			//没有函数执行
			if(this.isRun) {
				//进行中状态
				this.isRun = false;
				//从头拿出函数
				let fn = this.handlers.shift();
				fn.apply(fn.ctx, fn.args);
			}
		}
		//运行下一个任务
		next() {
			this.isRun = true;
			if(this.handlers.length > 0) {
				this.run();
			}
		}
	}
	return Handler;
})