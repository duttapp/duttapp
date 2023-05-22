    var path = document.location.pathname;
	  
    var client;
    var element = []
       
      function LogOut(){

        document.getElementById("Signoff").action= "/Control?LogOut=true"

      }
	    
      function Connect(){
        
        client = new WebSocket("wss://192.168.43.62:9012/Control");
      
	        client.onopen = function (event) {
		      document.getElementById("Status").innerHTML = "Websocket Connected";
				
				  
		  };
      client.onmessage = function (event) {
        try{
          var Data = event.data ;
          var obj = JSON.parse(Data)
          console.log(obj);
        }
        catch(err){

        console.log(err.message);
        }
				
				  
		  };
		  
	        client.onclose = function (e) {
          document.getElementById("Status").innerHTML = "Websocket Disonnected";
      };
    };

    function Disconnect(){

	        client.close();
    };
    function Toggle(Node,id){
      var data = document.getElementById(id).checked;
      var Command = {
        Node: Node,
        ID: id,
        Value: data
      }
   
      console.log(Command);
      client.send(JSON.stringify(Command));
    }; 

    function Node_1(){
      var XMLRequest = new XMLHttpRequest();
      XMLRequest.onreadystatechange = function (){

        if(this.readyState == 4 && this.status == 200){
     
         const List = document.getElementById("Console");
         while(List.hasChildNodes()){
            
            console.log("Removed Child");
            List.removeChild(List.firstChild);
          
            }
        
        GetElement(this.responseXML);
        
      }
    };
      XMLRequest.open("GET", "/Control/Node_1.xml", true);
      XMLRequest.send();

    
  };
    function Node_2(){
      var XMLRequest = new XMLHttpRequest();
      XMLRequest.onreadystatechange = function (){

        if(this.readyState == 4 && this.status == 200){
          const List = document.getElementById("Console");
          while(List.hasChildNodes()){
             
             console.log("Removed Child");
             List.removeChild(List.firstChild);
           
             }
           GetElement(this.responseXML)
        }
        
      };
      XMLRequest.open("GET", "/Control/Node_2.xml", true);
      XMLRequest.send();

    };

    function Node_3(){
      var XMLRequest = new XMLHttpRequest();
      XMLRequest.onreadystatechange = function (){

        if(this.readyState == 4 && this.status == 200){
          const List = document.getElementById("Console");
          while(List.hasChildNodes()){
            
             List.removeChild(List.firstChild);
           
             }
           
           GetElement(this.responseXML)
        }
        
      };
      XMLRequest.open("GET", "/Control/Node_3.xml", true);
      XMLRequest.send();

    };

    function Node_4(){
      var XMLRequest = new XMLHttpRequest();
      XMLRequest.onreadystatechange = function (){

        if(this.readyState == 4 && this.status == 200){
          const List = document.getElementById("Console");
          while(List.hasChildNodes()){
             
                  List.removeChild(List.firstChild);
           
             }
           
           GetElement(this.responseXML)
        }
        
      };
      XMLRequest.open("GET", "/Control/Node_4.xml", true);
      XMLRequest.send();

    };

    function Node_5(){
      var XMLRequest = new XMLHttpRequest();
      XMLRequest.onreadystatechange = function (){

        if(this.readyState == 4 && this.status == 200){
          const List = document.getElementById("Console");
          while(List.hasChildNodes()){
             
             console.log("Removed Child");
             List.removeChild(List.firstChild);
           
             }
           
           GetElement(this.responseXML)
        }
        
      };
      XMLRequest.open("GET", "/Control/Node_5.xml", true);
      XMLRequest.send();

    };
  
    function GetElement(xml){
      var X = xml.getElementsByTagName("ID");
      var Y = xml.getElementsByTagName("Node")
      var Node = Y[0].childNodes[0].nodeValue;
      console.log(Node);
      for(i = 0; i < X.length; i++) {
      
        element[i] = X[i].childNodes[0].nodeValue;
        var Switch_Light = document.createElement("INPUT");
        var Switch_Label = document.createElement("LABEL");
        var Switch_Span = document.createElement("SPAN");
        var Actual_Label =document.createElement("LABEL");
        Switch_Light.type = "checkbox";
        Switch_Light.id = element[i];
        Switch_Light.value = "ON";
        Switch_Light.setAttribute("onclick", `Toggle('${Node}','${element[i]}')`);
        Switch_Label.id = `${element[i]}_Label`;
        Switch_Span.id = `${element[i]}_Span`;
        Actual_Label.textContent = element[i];
        Actual_Label.for = Switch_Light;
        document.getElementById("Console").appendChild(Actual_Label);
        document.getElementById("Console").appendChild(Switch_Label);
        document.getElementById(`${element[i]}_Label`).appendChild(Switch_Light);
        document.getElementById(`${element[i]}_Label`).appendChild(Switch_Span);
      }


    };


