
function Connecttoserver(){
	      
          client = new WebSocket("wss://192.168.43.1:9012/");
	          client.onopen = function (event) {
		      document.getElementById("Status").innerHTML = "Connected";
				
				  
		  };
		  
	     client.onclose = function (e) {
		      document.getElementById("Status").innerHTML = "Disconnected";
	      };
         client.onmessage = function(event) {
          
		  var msg = event.data;
		  var image;
	      var msg_sub;
	      
		  if(msg === "Ldrawingroom::ON")
		  {
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
             image.src = "ledon.jpg";
		  }
		  else if(msg === "Ldrawingroom::OFF"){
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
		     image.src = "ledoff.jpg";
		  }
		   else if(msg === "Lbedroom::ON")
		  {
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
             image.src = "ledon.jpg";
		  }
		  else if(msg === "Lbedroom::OFF"){
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
		     image.src = "ledoff.jpg";
		  }
		   else if(msg === "Lbathroom::ON")
		  {
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
             image.src = "ledon.jpg";
		  }
		  else if(msg === "Lbathroom::OFF"){
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
		     image.src = "ledoff.jpg";
		  }
		   else if(msg === "Lcorridor::ON")
		  {
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
             image.src = "ledon.jpg";
		  }
		  else if(msg === "Lcorridor::OFF"){
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
		     image.src = "ledoff.jpg";
		  }
		   else if(msg === "Lbalcony::ON")
		  {
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
             image.src = "ledon.jpg";
		  }
		  else if(msg === "Lbalcony::OFF"){
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
		     image.src = "ledoff.jpg";
		  }
		  else if(msg === "Lstoreroom::ON")
		  {
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
             image.src = "ledon.jpg";
		  }
		  else if(msg === "Lstoreroom::OFF"){
		     msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
		     image.src = "ledoff.jpg";
		  }
		
		  else if(msg === "Fdrawingroom::ON"){
			 msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
		     image.src = "fan-on.gif";
		  }
		  else if(msg === "Fdrawingroom::OFF"){
			 msg_sub = msg.substring(0,msg.indexOf(":"));
		     image = document.getElementById(msg_sub);
		     image.src = "fan-off.png";
		  }
	
			  
         };
		
 
		 
  client.onerror = function(event) {
		  
		  alert(event.code.value);
		  
		  if(!Close.Event.wasClean)
		  {
			  alert('WebSocket Error ', event);
		  }
          else{
		   
		      alert('Normal Disconnect', event);
          }
	  
	     };
};

 function DrawWaterTank(){
	       var c = document.getElementById("WaterManagementSystem");
		   var ctx = c.getContext("2d");
           var image = new Image();
		   image.src = 'TankImage.jpg'
		   image.onload = function(){
		     ctx.drawImage(image,100,0);
		   };
		  };
  function Logout(){
  	if (confirm("Do you wany to logout ?") == true)
	{
	    window.location.replace('/');
	}
	  else{}
	
    };
		  
function Disconnectserver(){
	
	client.close();
	document.getElementById("Status").innerHTML = "Disconnected";
	                 
        };

function changeStatusFan(idofelement) {
	  
	      var IDOfInput = idofelement.id;
		  image = document.getElementById(IDOfInput);
		  if (image.src.match("on")){
          client.send(IDOfInput +  "::OFF");
		  
		  }
		  else if(image.src.match("off")){
		   client.send(IDOfInput +  "::ON");
		   
		  }
		
		  
        };
		
function changeStatusLight(idofelement) {
          var IDOfInput = idofelement.id;
		  image = document.getElementById(IDOfInput);
          if (image.src.match("on")) {
          client.send(IDOfInput +  "::OFF");
		
          }
		  else if(image.src.match("off")){
          client.send(IDOfInput + "::ON");
		  
          }
     };