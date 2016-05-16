function processComments() {
	var els = [].slice.call(document.querySelectorAll('.userContent, .UFICommentBody'));
	els.filter((el, i)=>{
	    return el.innerHTML.indexOf('`') > -1
	    }).forEach((el, i) => {
	    	if (/See More/g.test(el.innerHTML)) return;
	    	var formal = /```.*````/gm.test(el.innerText);
	    	var informal = /`.*`/gm.test(el.innerText);
	    	
	    	if (!formal && !informal) return; // there are no code blocks
	        el.innerHTML = el.innerHTML.replace(/ /g, '&nbsp;');
	        //el.innerText = el.innerText.replace(/\n/g, '<n>');
	        var blocks = [el.innerText];
	        // check if there are any actual matches
	        if (formal){
				blocks = el.innerText.split('```');
		        if (blocks.length > 1){
		            // we have some formal code in here
		            for (var i = 1; i < blocks.length; i += 2){
		                var code = document.createElement('pre');
		                code.className = "prettyprint lang-js";
		                code.innerText = blocks[i];
		                blocks[i] = code.outerHTML;
		            }
		        }
	    	}
	        // join the blocks back together now
	        blocks = blocks.join();
	        // now split on the single backtick to process the rest of the code blocks
	        if (informal){
	        	blocks = blocks.split('`');
		        for (var i = 1; i < blocks.length; i += 2){
	                var code = document.createElement('code');
	                code.className = "prettyprint";
	                code.innerText = blocks[i];
	                blocks[i] = code.outerHTML;
	            }
	        }
	        console.log(blocks);
	        blocks = blocks.join("").replace(/&lt;n&gt;/g, '<br>');
	        el.outerHTML = blocks;
	        PR.prettyPrint();
	});
}

window.addEventListener('load', processComments);
document.addEventListener('click', function(){
	setTimeout(function(){processComments()}, 500);
})

//TODO: hack in AJAX listening
// this doesn't actually do anything...
// var xmlOpen = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function(){
// 	console.log('opening');
// 	this.addEventListener("readystatechange", processComments);
// 	xmlOpen.apply(this, arguments);
// }