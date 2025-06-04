import { DataNode } from "ant-design-vue/es/tree";

export const recursive = (node:DataNode)=>{
    //do sth
    console.log(753,node);
    if(node.children){
        for(let i=0;i<node.children.length;i++){
            recursive(node.children[i])
        }
    }
}

export const handleResize = (w: number, col:any) => {
    if (col) {
      col.width = w;
    }
    // console.log(369,col);
    
  }