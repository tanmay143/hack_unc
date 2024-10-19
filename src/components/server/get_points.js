const get_points=(new_shapes,item,coordinates,id_elements)=>{
    const {start,end}= item.start.id,item.end.id;
    const points=[];
    if(!(start in coordinates) && !(end in coordinates)){
        return item.points;
    }
    else if(start in coordinates && end in coordinates){
        return get_edges(start,end,coordinates);
    }
    else{
        if(start in coordinates){
            
        }
    }
    
  
  
  }



