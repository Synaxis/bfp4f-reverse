function CreateApp()
{
	return new (EASY.extend({
		
		constructor: function () {
			// Call parent constructor
			EASY.apply(this, arguments);
			
			var easyLog = this.log;
			
			this.log = function () {
				if (this.debug) {
					gameLog();
				}
				return easyLog.apply(this, arguments);
			};
			
			_.forEach(_.keys(easyLog), function (method) {
				this.log[method] = easyLog[method];
			}, this);
		},
				
		sidis: {
			trans: function (msg) {
				return msg;
			}
		},
		
		/**
		 * Task
		 */
		task: function taskApplication() {
			
			var args = _.toArray(arguments),
				name = args.shift(),
				fn = args.pop(),
				waitForTasks = args.shift() || [];
			
			if (!_.isArray(waitForTasks)) {
				waitForTasks = [ waitForTasks ];
			}
			
			// Check so the we don't add duplicates
			if (tasks.hasOwnProperty(name)) {
				throw new Error('Task with name "' + name + '" already defined');
			}
			
			// Check so the we don't add non functions
			if (fn === 'function') {
				throw new Error('Task with name "' + name + '" must to be a function!');
			}
			
			// We aren't done yet
			isReady = this.isReady = false;
			
			// Add to task queue
			if (waitForTasks.length === 0) {
				tasks[name] = fn;
			} else {
				tasks[name] = function (done) {
					APP.onTask(waitForTasks, function () {
						fn(done);
					});
				};
			}
			tasks[name].status = TASK_STATUS_WAITING;
			tasks[name].dependsOn = waitForTasks; 
			
			// Run tasks
			if (isStarted) {
				runTasks();
			}
			
			return this;
		},
		
		/**
		 * DOM Task
		 */
		domTask: function domTaskApplication() {
			var args = _.toArray(arguments),
				name = args.shift(),
				fn = args.pop(),
				waitForTasks = args.shift() || [];
			
			if (!_.isArray(waitForTasks)) {
				waitForTasks = [ waitForTasks ];
			}
			
			waitForTasks.unshift('dom');
			
			APP.task(name, waitForTasks, fn);
			
			return this;
		},
		
		/**
		 * On Task
		 */
		onTask: function onTaskApplication() {
			
			var args = _.toArray(arguments),
				fn = args.pop(),
				len,
				name,
				i,
				isWaiting = true,
				check = function check() {
					var len = args.length,
						name,
						i;
					
					// Loops over each task
					for (i = 0; i < len; i += 1) {
						name = args[i];
						// If the task does not exists or not got the done status
						// it has not yet been completed so we can't trigger
						// the task listener callback
						if (!tasks.hasOwnProperty(name) || tasks[name].status !== TASK_STATUS_DONE) {
							return;
						}
					}
					
					// Make sure it's async
					setTimeout(function triggerTaskListener() {
						if (runTasks.halt !== true && isWaiting) {
							fn();
							isWaiting = false;
						}
					}, 0);
				};
			
			if (args.length === 1 && _.isArray(args[0])) {
				args = args[0];
			} 
			
			// Loops over each task
			for (i = 0, len = args.length; i < len; i += 1) {
				name = args[i];
				// If the task does not exists or not got the done status
				// it has not yet been completed so we can't trigger
				// the task listener callback
				if (!tasks.hasOwnProperty(name) || tasks[name].status !== TASK_STATUS_DONE) {
					APP.once('task:' + name, check);
				}
			}
			
			// Run a check
			check();
			
			return this;
		},
		
		
		/**
		 * Ready
		 */
		ready: function readyApplication(fn) {
			if (isReady) {
				_.defer(fn);
			} else {
				this.once('ready', fn);
			}
			return this;
		},
		
		
		/**
		 * Start
		 */
		start: function startApplication() {
			if (isStarted) {
				return this;
			}
			
			this.log.time('APPLICATION :: START');
			
			isStarted = true;
			
			var msReadyTimeout = 2 * 60 * 1000, // the time we will wait for the ready event
				readyTimer = setTimeout(function onReadyTimeout() {
					runTasks.halt = true;
					
					var uncompletedTasks = [],
						error = 'Failed to get the ready event in time'; // TODO: Localize
					
					_.forEach(tasks, function eachTaskName(task, name) {
						if (task.status !== TASK_STATUS_DONE) {
							uncompletedTasks.push(JSON.stringify({
								task: name,
								status: task.status,
								dependsOn: _.map(task.dependsOn, function (dep) {
									return dep + '=' + tasks[dep].status;
								}).join(', ')
							}));
						}
					});
					
					APP.log.warn('Remaining Tasks:\n' + uncompletedTasks.join('\n'));
					
					APP.trigger('error', {
						body: error,
						close: false
					});
				}, msReadyTimeout),
				onError,
				onReady,
				onTask,
				$progress = this.$splash.find('div.progress-meter'),
				totalTaskCount = _.keys(tasks).length + 1,
				taskCount = 0;
			
			
			// On Error
			onError = _.bind(function onErrorStartApplication() {
				// Clear ready timer
				if (readyTimer) {
					clearTimeout(readyTimer);
				}
				
				// Halt tasks
				runTasks.halt = true;
				
				// Unbind stuff
				this.unbind('error', onError);
				this.unbind('ready', onReady);
				this.unbind('task', onTask);
				
				this.$splash.addClass('error');
				
			}, this);
			
			
			// On Ready
			onReady = _.bind(function onReadyStartApplication() {
				var $win = $(APP.win);
				
				// Clear ready timer
				if (readyTimer) {
					clearTimeout(readyTimer);
				}
				
				APP.win.playSound('LoadedSoldier', 'Login is complete');
				
				this.$main.addClass('loaded');
				
				// Unbind stuff
				this.unbind('error', onError);
				this.unbind('ready', onReady);
				this.unbind('task', onTask);
				
				// F5 reloads in front-end
				if (APP.win.game && APP.ns('config').debug) {
					$win.bind('keydown', function onKeyDown(e) {
						if (e.keyCode === 116) {
							APP.reload();
						}
					});
				}
				
				// On before unload
				$win.one('beforeunload', _.bind(function () {
					this.showSplash();
				}, this));
				
				// We start on the home page
				win.location.hash = 'home';
				
				// Start watching the history
				Backbone.history.start();
				
				// Everything is ready. Show frontend
				$progress.css('width', '100%');
				_.delay(_.bind(function () {
					this.hideSplash();
					this.$splash.find('div.progress-bar').remove();
					this.log.timeEnd('APPLICATION :: START');
					this.log.timeEnd('APPLICATION :: START');
				}, this), 200);
				
			}, this);
			
			
			// On task
			onTask = function () {
				taskCount += 1;
				var progress = (taskCount / totalTaskCount) * 100;
				$progress.css('width', progress + '%');
			};
			
			// Handle errors while loading
			this.bind('error', onError);
			
			// Handle ready
			this.bind('ready', onReady);
			
			// Handle task progress
			this.bind('task', onTask);
			
			// Hide pages
			this.$main.find('div.main').addClass('hidden');
			
			// Run tasks
			runTasks();
			
			return this;
		},
		
		/**
		 * Page
		 */
		page: function pageApplication(page, data) {
			data = data || {};
			
			var $mains = this.$main.find('div.main'),
				from = (($mains.not('.hidden').attr('class') || '').match(/main_([^\s]+)/) || []).pop(),
				found = false;
			
			if (page === true) {
				from = page;
			}
			
			if (page === from) {
				found = true;
			} else {
				$mains.each(function () {
					var $page = $(this);
					if ($page.hasClass('main_' + page)) {
						found = true;
						if (!$page.is(':visible')) {
							$page.hide().removeClass('hidden').fadeIn('slow');
						}
					} else {
						$page.addClass('hidden');
					}
				});
			}
			
			if (found) {
				this.trigger('page', page, from, data);
				this.trigger('page:' + page, from, data);
			} else {
				throw new Error('Unable to show page "' + page + '"');
			}
			
			return this;
		},
		currentPage: function () {
			var $mains = this.$frontend.find('div.main'),
				from = (($mains.not('.hidden').attr('class') || '').match(/main_([^\s]+)/) || []).pop();
				
			return from;
		},
		
		/**
		 * Show splash
		 */
		showSplash: function showSplashApplication() {
			this.$splash.show();
			this.$main.hide();
			APP.win.hideDoll();
			return this;
		},
		
		
		/**
		 * Hide splash
		 */
		hideSplash: function hideSplashApplication() {
			this.$splash.hide();
			this.$main.show();
			return this;
		},
		
		
		/**
		 * Reload
		 */
		reload: function reloadApplication(delay) {
			delay = delay || 0;
			
			_.delay(function () {
				APP.win.location.reload();
			}, delay);
			
			return this;
		}
	}))();
}