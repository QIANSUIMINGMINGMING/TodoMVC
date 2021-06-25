# TodoMVC
Pure JS, CSS, Html developed mobile web app

页面持久化代码：

```javascript
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
```

点击改变item 和table的内容

```javascript
var changeContentEvent = function(event){
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
```

下拉菜单关键代码

```javascript
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
```

