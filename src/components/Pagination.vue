<template>
  <div class="pagination">
    <button @click='setCurrentPage("prev")' :style="{display: currentPage<=1?'none':''}">上一页</button>
    <span v-if='currentPage > 3&&totalPagesNum>5' style="color: whitesmoke">...</span>
    <span @click='setCurrentPage("",item)' :style="{color: currentPage===item?'aquamarine':'whitesmoke'}" v-for='item in list' :key='item'>
      {{item}}
    </span>
    <span v-if='(currentPage < props.total - 2)&&(props.total>5)' style="color: whitesmoke">...</span>
    <button @click='setCurrentPage("next")' :style="{display: currentPage===totalPagesNum?'none':''}">下一页</button>
  </div>
</template>

<script setup>
  import { ref, watch } from "vue";
  const props = defineProps({
    total: { type: [Number, String], default: 0 }, // 总页数
    pageNum: { type: [Number, String], default: 1 }, // 当前页数
  });
  const emit = defineEmits(["page-change", "size-change"]);
  /** 当前激活的页码 */
  const currentPage = ref(Number(props.pageNum));
  /** 总页数 */
  const totalPagesNum = ref(Number(props.total));
  const list=ref([])

  setCurrentPage("",1,true)

  function setCurrentPage(type, pageNum = 1,isInit){
    type === "prev" ? currentPage.value-- : type === "next" ? currentPage.value++ : (currentPage.value = Number(pageNum));
    console.log(totalPagesNum.value,props.total)
    // 限制页码的边界值，最小为 1，最大不超过总页数
    if (totalPagesNum.value>5){
      if (currentPage.value<=totalPagesNum.value-2&&currentPage.value>=3){
        list.value=[currentPage.value-2,currentPage.value-1,currentPage.value,currentPage.value+1,currentPage.value+2]
      }else if (currentPage.value>totalPagesNum.value-2){
        list.value=[totalPagesNum.value-4,totalPagesNum.value-3,totalPagesNum.value-2,totalPagesNum.value-1,totalPagesNum.value]
      }else {
        list.value=[1,2,3,4,5]
      }
    }else{
      const listcopy=[]
      for (let i=1;i<=totalPagesNum.value;i++){
        listcopy.push(i);
      }
      list.value=listcopy;
    }
    currentPage.value = currentPage.value < 1 ? 1 : currentPage.value > totalPagesNum.value ? totalPagesNum.value : currentPage.value;
    if (!isInit){
      emit("pageChange", currentPage.value);
    }
  }
  watch(props,()=>{
    totalPagesNum.value=props.total
    setCurrentPage("",props.pageNum,true)
    console.log(props)
  })

</script>

<style scoped>
  .pagination{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  button{
    background-color: transparent;
    font-size: 20px;
    color: whitesmoke;
    font-weight: 900;
    border: transparent;
    margin: 1rem;
  }
  button:hover{
    opacity: 0.6;
  }
  span{
    background-color: transparent;
    font-size: 20px;
    font-weight: 900;
    cursor: url("../assets/pointer1.cur"),auto;
    margin: 1rem;
    opacity: 0.8;
  }
  span:hover{
    opacity: 0.5;
  }
</style>
