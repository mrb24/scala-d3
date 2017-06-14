require.config({
    baseUrl: './js'
});

var window, document, d3;

var console = {
	  log: function (msg) {
	    java.lang.System.out.println(msg);
	  },
	  error: function (msg) {
	    java.lang.System.out.println(msg);
	  },
	  info: function (msg) {
	    java.lang.System.out.println(msg);
	  }
};

/*function addcss(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.appendChild(document.createTextNode(css));
    head.appendChild(s);
 }*/

/*function setTimeout(expr, msec) { 
    var o = {actionPerformed: function(){eval(expr)}}; 
    var al = new java.awt.event.ActionListener(o); 
    var t = new javax.swing.Timer(msec, al); 
    t.start(); 
}*/


require(['domino/lib/index'], function(domino) {
	window = domino.createWindow('');
    document = window.document;
    console.log('loaded domino...')
    require(['d3/d3.min'], function(_d3) {
    	console.log('loaded d3...')
        d3 = _d3;
    });
    
});

// preload your modules
//require(["mypackage/mymodule1", "mypackage/mymodule2"]);