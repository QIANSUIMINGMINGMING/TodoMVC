var table_num = 1;
      var id_nums=[0];
      var item_nums = [0];
      var active_item_nums=[0];

      var changeContentEvent = function(){
        if(this.innerHTML.indexOf('type="text"') > 0 ){ 
          return                  
        }
        const newDiv = document.createElement( 'input' ) //创建一个input标签
        newDiv.type = 'text'     
        newDiv.style.width = '200px'
        newDiv.style.height = '25px'                       
        newDiv.value = this.innerHTML 
      
        this.innerHTML = ''      
        this.appendChild(newDiv)       
        newDiv.setSelectionRange(0, this.innerHTML.length) 
                                    
        newDiv.focus()             
      
        newDiv.onblur = blur
        function blur(){
          this.innerHTML = this.value 
        }

        newDiv.addEventListener('keyup',function(){ 
          if(event.keyCode == 13){ newDiv.blur() }})

      }
    
      window.onclick = function(event) {
          if(event.target.className!="dropDownBtn"){
          var dropdowns = document.getElementsByClassName("item-dropdown-content");
          for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display==="block") {
              openDropdown.style.display="none"
            }
          }
          if (event.target.className!="modifiable" && event.target.className!="tableTitle")
          {
            var mods = document.getElementsByClassName("modifiable");
            for (i = 0; i < mods.length; i++) {
              var m = mods[i];
              if(m.firstChild.tagName=="INPUT")
              {
                var texts = m.firstChild.value
                console.log(texts)
                m.innerHTML = ""
                m.innerHTML = texts
              }               
            }
            var tablets = document.getElementsByClassName("tableTitle")
            for (i = 0; i < tablets.length; i++) {
              var m = tablets[i];
              if(m.firstChild.tagName=="INPUT")
              {
                var texts = m.firstChild.value
                console.log(texts)
                m.innerHTML = ""
                m.innerHTML = texts
              }               
            }
          }
        }  
      }

      window.onbeforeunload= function(e){
        if(!window.localStorage){
          alert("浏览器不支持localStorage");
          return false;
        }
        else{
          var all_items = document.getElementsByClassName("todoItem")
          var all_tables = document.getElementsByClassName("todoTable")
          var all_table_ids = []
          var all_item_json = []
          for(var i = 0;i<all_tables.length;i++){
            all_table_ids.push(all_tables[i].id.substring(1))
          }
          for(var i=0;i<all_items.length;i++){
            var item_json={}
            for(var j=0;j<all_items[i].childNodes.length;j++){
              if(all_items[i].childNodes[j].type==="checkbox"){
                /*if(all_items[i].childNodes[j].checked===false)
                {item_json["checked"]=0;}
                else(all_items[i].childNodes[j].checked===true)
                {item_json["checked"]=1;}*/
                item_json["checked"]=all_items[i].childNodes[j].checked
              }
              if(all_items[i].childNodes[j].className==="modifiable"){
                item_json["content"]=all_items[i].childNodes[j].textContent;
              }
            }
            for(var k=0;k<all_table_ids.length;k++){
              if(all_table_ids[k]===all_items[i].parentNode.id.substring(5)){
                item_json["table"]=k+2
                break
              }
            }
            all_item_json.push(item_json)
          }

          var saveJson = {"table_num":all_tables.length+1,"items":all_item_json}
          saveJson = JSON.stringify(saveJson)
          window.localStorage.setItem("data",saveJson)
        }
      }

      window.onload=function(e){
        var local_data = JSON.parse(window.localStorage.getItem("data"))
        console.log(local_data)
        while(table_num<local_data["table_num"]){
          add_table()
        }
        for(var i=0;i<local_data["items"].length;i++){
          var table_i = local_data["items"][i]["table"]
          var the_table = document.getElementById("t"+table_i.toString())
          var this_item_id = add_one(the_table)
          var this_item = document.getElementById(this_item_id).childNodes
          for(var j=0;j<this_item.length;j++){
            if(this_item[j].type==="checkbox"){
              this_item[j].checked = local_data["items"][i]["checked"]
            }
            if(this_item[j].className==="modifiable"){
              this_item[j].innerHTML=local_data["items"][i]["content"]
              if(local_data["items"][i]["checked"]){
                active_item_nums[table_i-1]-=1
                this_item[j].style["text-decoration"]="line-through"

                var num_children = document.getElementById("table-num"+table_i.toString()).childNodes
                num_children[1].innerHTML = "total: " + item_nums[table_i-1].toString()
                num_children[3].innerHTML = "active: "+active_item_nums[table_i-1].toString()
                num_children[5].innerHTML = "completed: "+ (item_nums[table_i-1]-active_item_nums[table_i-1]).toString()
              }
            }
          }
        }
      }

      function check_active(item){
        var item_content = item.childNodes
        for(var i=0; i<item_content.length;i++){
          if(item_content[i].className=="modifiable"){
            if(item_content[i].style["text-decoration"]==="line-through"){
              return true;
            }
            else{
              return false
            }
          }
        }
      }

      function add_table(){
        table_num+=1;
        item_nums.push(0)
        id_nums.push(0)
        active_item_nums.push(0)
        var new_table = document.createElement("div");
        new_table.id="t"+table_num.toString();
        new_table.className = "todoTable";

        var table_title = document.createElement("p")
        table_title.innerHTML="table name: click to modify"
        table_title.className = "tableTitle"
        table_title.addEventListener("click",changeContentEvent)

        var add_button = document.createElement("input")
        add_button.type="button"
        add_button.className = "item-add-btn"
        add_button.value = "add"

        var dlt_button = document.createElement("input")
        dlt_button.type="button"
        dlt_button.className = "item-dlt-btn"
        dlt_button.value = "remove"

        var clear_btn = document.createElement("input")
        clear_btn.type="button"
        clear_btn.className="table-clear"
        clear_btn.value="clear"

        var item_list = document.createElement("div")
        item_list.id="Items"+table_num.toString();
        item_list.className="items"

        var tableNumbers = document.createElement("div")
        tableNumbers.id="table-num"+table_num.toString()
        tableNumbers.className="item-num-bar"
        tableNumbers.appendChild(document.createElement("text"))
        
        var total_item = document.createElement("div")
        var active_item = document.createElement("div")
        var completed_item = document.createElement("div")

        total_item.innerHTML="total: 0"
        active_item.innerHTML ="active: 0"
        completed_item.innerHTML="completed: 0"
        
        tableNumbers.appendChild(total_item)
        tableNumbers.appendChild(document.createElement("text"))
        tableNumbers.appendChild(active_item)
        tableNumbers.appendChild(document.createElement("text"))
        tableNumbers.appendChild(completed_item)
        tableNumbers.appendChild(document.createElement("text"))

        new_table.appendChild(table_title)

        var complete_all = document.createElement("input")
        complete_all.value = "finish"
        complete_all.type="button"
        complete_all.className="complete_all_box"
        new_table.appendChild(complete_all)

        var revert_all = document.createElement("input")
        revert_all.value = "revert";
        revert_all.type="button"
        revert_all.className="revert_all_box"
        new_table.appendChild(revert_all)

        new_table.appendChild(add_button)
        new_table.appendChild(clear_btn)
        new_table.appendChild(dlt_button)
        new_table.appendChild(tableNumbers)
        new_table.appendChild(item_list)
        
        document.body.appendChild(new_table)
        add_button.addEventListener("click", function(e){
          add_one(e.target.parentNode)
        })

        clear_btn.addEventListener("click",function(e){
          var table_children = e.target.parentNode.childNodes
          var remove_list=[]
          for(var i=0;i<table_children.length;i++){
            if(table_children[i].className==="items"){
              var table_items = table_children[i].childNodes
              for(var j=0;j<table_items.length;j++)
              {
                if(check_active(table_items[j]))
                  {
                    table_items[j].id="temp"+j.toString()
                    remove_list.push(table_items[j].id)
                  }
              }

              item_nums[parseInt(new_table.id.substring(1))-1]-=remove_list.length
              
              for(var remove_item=0;remove_item<remove_list.length;remove_item++){
                table_children[i].removeChild(document.getElementById(remove_list[remove_item]))
              }
              break
            }
          }

          var table_id = parseInt(new_table.id.substring(1))
          var num_children = document.getElementById("table-num"+table_id.toString()).childNodes
          num_children[1].innerHTML = "total: " + item_nums[table_id-1].toString()
          num_children[3].innerHTML = "active: "+active_item_nums[table_id-1].toString()
          num_children[5].innerHTML = "completed: "+ (item_nums[table_id-1]-active_item_nums[table_id-1]).toString()

        })

        dlt_button.addEventListener("click",function(e){
          var removed_id = e.target.parentNode.id
          removed_id = parseInt(removed_id.substring(1))-1
          id_nums[removed_id]=0
          item_nums[removed_id]=0
          active_item_nums[removed_id]=0
          e.target.parentNode.parentNode.removeChild(e.target.parentNode)
        })

        complete_all.addEventListener("click",function(e){
          var table_id=parseInt(e.target.parentNode.id.substring(1))
          var the_table_items = document.getElementById("Items"+table_id.toString()).childNodes
          for(var i=0;i<the_table_items.length;i++){
            if(!check_active(the_table_items[i])){
              var all_item_contents = the_table_items[i].childNodes
              for(var j=0;j<all_item_contents.length;j++){
                if(all_item_contents[j].className === "modifiable"){
                  all_item_contents[j].style["text-decoration"]="line-through"
                }
                if(all_item_contents[j].type==="checkbox"){
                  all_item_contents[j].checked = true
                }
              }
            }
          }
          active_item_nums[table_id-1]=0
          var num_children = document.getElementById("table-num"+table_id.toString()).childNodes
          num_children[1].innerHTML = "total: " + item_nums[table_id-1].toString()
          num_children[3].innerHTML = "active: "+active_item_nums[table_id-1].toString()
          num_children[5].innerHTML = "completed: "+ (item_nums[table_id-1]-active_item_nums[table_id-1]).toString()
        })

        revert_all.addEventListener("click",function(e){
          var table_id=parseInt(e.target.parentNode.id.substring(1))
          var the_table_items = document.getElementById("Items"+table_id.toString()).childNodes
          for(var i=0;i<the_table_items.length;i++){
            if(check_active(the_table_items[i])){
              var all_item_contents = the_table_items[i].childNodes
              for(var j=0;j<all_item_contents.length;j++){
                if(all_item_contents[j].className === "modifiable"){
                  all_item_contents[j].style["text-decoration"]="none"
                }
                if(all_item_contents[j].type==="checkbox"){
                  all_item_contents[j].checked = false
                }
              }
            }
          }
          active_item_nums[table_id-1]=item_nums[table_id-1]
          var num_children = document.getElementById("table-num"+table_id.toString()).childNodes
          num_children[1].innerHTML = "total: " + item_nums[table_id-1].toString()
          num_children[3].innerHTML = "active: "+active_item_nums[table_id-1].toString()
          num_children[5].innerHTML = "completed: "+ (item_nums[table_id-1]-active_item_nums[table_id-1]).toString()
        })
      }

      function add_one(table){
        var new_todo_item = document.createElement("div");
        var table_id = parseInt(table.id.substring(1));
        id_nums[table_id-1]+=1;
        item_nums[table_id-1]+=1;
        active_item_nums[table_id-1]+=1;

        var num_children = document.getElementById("table-num"+table_id.toString()).childNodes
        console.log(num_children)
        num_children[1].innerHTML = "total: " + item_nums[table_id-1].toString()
        num_children[3].innerHTML = "active: "+active_item_nums[table_id-1].toString()
        num_children[5].innerHTML = "completed: "+ (item_nums[table_id-1]-active_item_nums[table_id-1]).toString()

        //console.log(item_nums[table_id-1])
        //console.log(active_item_nums[table_id-1])

        new_todo_item.id = "item"+table_id.toString()+"-"+id_nums[table_id-1].toString();
        new_todo_item.className="todoItem";
        //console.log(new_todo_item.id)
        //console.log(item_nums)

        
        var check_box = document.createElement("input");
        check_box.type = "checkbox";
        check_box.addEventListener("click", function(e){
          var parent = this.parentNode;
          var children = parent.childNodes;
          for(var i=0;i<children.length;i++){
            if(children[i].className==="modifiable")
              if(children[i].style["text-decoration"]!="line-through"){
                children[i].style["text-decoration"]="line-through"
                active_item_nums[table_id-1] -=1
                var num_children = document.getElementById("table-num"+table_id.toString()).childNodes
                num_children[1].innerHTML = "total: " + item_nums[table_id-1].toString()
                num_children[3].innerHTML = "active: "+active_item_nums[table_id-1].toString()
                num_children[5].innerHTML = "completed: "+ (item_nums[table_id-1]-active_item_nums[table_id-1]).toString()
              }
                
              else{
                children[i].style["text-decoration"]="none"
                active_item_nums[table_id-1] +=1
                var num_children = document.getElementById("table-num"+table_id.toString()).childNodes
                num_children[1].innerHTML = "total: " + item_nums[table_id-1].toString()
                num_children[3].innerHTML = "active: "+active_item_nums[table_id-1].toString()
                num_children[5].innerHTML = "completed: "+ (item_nums[table_id-1]-active_item_nums[table_id-1]).toString()
              }
              //console.log(item_nums[table_id-1])
              //console.log(active_item_nums[table_id-1])
          }
        })

        var item_content = document.createElement("p");

        item_content.className="modifiable";
        item_content.textContent = "click to modify";
        item_content.addEventListener('click',changeContentEvent)
        
        new_todo_item.appendChild(check_box);
        new_todo_item.appendChild(item_content);

        var selector = document.createElement("div");
        selector.className="itemDropDown";
        var dropDownButton = document.createElement("input");
        dropDownButton.type="button";
        dropDownButton.value = "choices";
        dropDownButton.className="dropDownBtn"

        var item_choices = document.createElement("div")
        item_choices.className ="item-dropdown-content"

        var dup = document.createElement("input")
        dup.type="button";
        dup.value = "duplication";
        item_choices.appendChild(dup)
        var mov = document.createElement("input")
        mov.type="button";
        mov.value = "move";
        item_choices.appendChild(mov)
        var dlt = document.createElement("input")
        dlt.type="button";
        dlt.value = "delete";

        dup.addEventListener("click",function(){
          var this_item = this.parentNode.parentNode.parentNode
          var this_modifiable
          var this_check_box
          if(check_active(this_item)){
            active_item_nums[table_id-1]-=1
          }

          for(var i=0;i<this_item.childNodes.length;i++){
            if(this_item.childNodes[i].className==="modifiable"){
              this_modifiable=this_item.childNodes[i]
            }
            if(this_item.childNodes[i].type==="checkbox"){
              this_check_box = this_item.childNodes[i]
            }
          }
          //this.parentNode.parentNode.parentNode.parentNode.appendChild(this.parentNode.parentNode.parentNode.cloneNode(true))
          var dup_item_id = add_one(this.parentNode.parentNode.parentNode.parentNode.parentNode)
          console.log(dup_item_id)
          var new_dup = document.getElementById(dup_item_id)

          var dup_children = new_dup.childNodes
          for(var i=0;i<dup_children.length;i++){
            if(dup_children[i].className==="modifiable"){
              dup_children[i].innerHTML=this_modifiable.innerHTML
              dup_children[i].style["text-decoration"] = this_modifiable.style["text-decoration"]
            }
            if(dup_children[i].type==="checkbox"){
              dup_children[i].checked = this_check_box.checked
            }
          }
        })

        dlt.addEventListener("click",function(){
          var this_item = this.parentNode.parentNode.parentNode
          item_nums[table_id-1]-=1
          if(!check_active(this_item)){
            active_item_nums[table_id-1]-=1
          }
          var num_children = document.getElementById("table-num"+table_id.toString()).childNodes
          num_children[1].innerHTML = "total: " + item_nums[table_id-1].toString()
          num_children[3].innerHTML = "active: "+active_item_nums[table_id-1].toString()
          num_children[5].innerHTML = "completed: "+ (item_nums[table_id-1]-active_item_nums[table_id-1]).toString()

          this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode)
        })

        item_choices.appendChild(dlt)

        item_choices.style.display="none"

        dropDownButton.addEventListener("click", function(){
          var children = this.parentNode.childNodes
          for(i=0;i<children.length;i++){
            if(children[i].className==="item-dropdown-content"){
              children[i].style.display ="block"
              break
            }
          }
        })

        selector.appendChild(dropDownButton);
        selector.appendChild(item_choices);
        new_todo_item.appendChild(selector);

        var table_items = document.getElementById("Items"+table_id.toString());
        table_items.appendChild(new_todo_item);
        return new_todo_item.id
      }