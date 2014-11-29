// jQuery File Tree Plugin
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 24 March 2008
//
// Visit http://abeautifulsite.net/notebook.php?article=58 for more information
//
// Usage: $('.fileTreeDemo').fileTree( options, callback )
//
// Options:  root           - root folder to display; default = /
//           script         - location of the serverside AJAX file to use; default = jqueryFileTree.php
//           folderEvent    - event to trigger expand/collapse; default = click
//           expandSpeed    - default = 500 (ms); use -1 for no animation
//           collapseSpeed  - default = 500 (ms); use -1 for no animation
//           expandEasing   - easing function to use on expand (optional)
//           collapseEasing - easing function to use on collapse (optional)
//           multiFolder    - whether or not to limit the browser to one subfolder at a time
//			 folderSelect	- Only show folders, not files.
//			 exclude  		- Adds hidden class to files and folders by name or by extension.
//           loadMessage    - Message to display while initial tree loads (can be HTML)
//
// TERMS OF USE
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//
var content;
if(jQuery) (function($){
	
	$.extend($.fn, {
		fileTree: function(o, h) {
			// Defaults
			if( !o ) var o = {};
			if( o.root == undefined ) o.root = '/';
			if( o.script == undefined ) o.script = 'jqueryFileTree.php';
			if( o.folderEvent == undefined ) o.folderEvent = 'click';
			if( o.expandSpeed == undefined ) o.expandSpeed= 500;
			if( o.collapseSpeed == undefined ) o.collapseSpeed= 500;
			if( o.expandEasing == undefined ) o.expandEasing = null;
			if( o.collapseEasing == undefined ) o.collapseEasing = null;
			if( o.multiFolder == undefined ) o.multiFolder = true;
			if( o.folderSelect == undefined ) o.folderSelect = false;
			if( o.exclude == undefined ) o.exclude = [];
			if( o.loadMessage == undefined ) o.loadMessage = 'Loading...';
			
			

			$(this).each( function() {
				
				function showTree(el, loc) {
					$(el).addClass('wait');
					$(".jqueryFileTree.start").remove();
					$.post(o.script, { dir: loc }, function(data) {
						$(el).find('.start').html('');
						//var content;
						if(o.folderSelect) {
							// Reform data to not include files.
							content = $('<ul class="jqueryFileTree" style="display: none;"></ul>').append($(data).children().filter('.directory')).prop('outerHTML');
						} else if(o.exclude.length !== 0) {
							// Reform data to remove excluded options.
							content = $('<ul class="jqueryFileTree" style="display: none;"></ul>');
							content.append($(data).children().each(function() {
								for(i = 0; i < o.exclude.length; i++) {
									if($(this).hasClass('ext_' + o.exclude[i].split('.')[1])) {
										$(this).addClass('hidden')
									} else if($(this).children('a').html() === o.exclude[i]) {
										$(this).addClass('hidden')
									}
								}
							}));
						} else {
							content = data;
						}

						$(el).removeClass('wait').append(content);
						if(o.root == loc) {
							$(el).find('UL:hidden').show();
						} else {
							$(el).find('UL:hidden').slideDown({ duration: o.expandSpeed, easing: o.expandEasing });
						}
						bindTree(el);
					});
				}
				
				function bindTree(t) {
					$(t).find('LI A').bind(o.folderEvent, function() {
						if( $(this).parent().hasClass('directory') ) {
							if( $(this).parent().hasClass('collapsed') ) {
								// Expand
								if( !o.multiFolder ) {
									$(this).parent().parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
									$(this).parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
								}
								$(this).parent().find('UL').remove(); // cleanup
								showTree( $(this).parent(), escape($(this).attr('rel').match( /.*\// )));
								$(this).parent().removeClass('collapsed').addClass('expanded');
							} else {
								// Collapse
								$(this).parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
								$(this).parent().removeClass('expanded').addClass('collapsed');
							}
							if(o.folderSelect) {
								h($(this).attr('rel'));
							}
						} else {
							h($(this).attr('rel'));
						}
						return false;
					});
					// Prevent A from triggering the # on non-click events
					if(o.folderEvent.toLowerCase != 'click') {
						$(t).find('LI A').bind('click', function() {
							return false;
						});
					}
				}
				// Loading message
				$(this).html('<ul class="jqueryFileTree start"><li class="wait">' + o.loadMessage + '<li></ul>');

				// Get the initial file list
				showTree($(this), escape(o.root));
			});
		}
	});
	
})(jQuery);