<template>
    <div id="user_view" class="page_body">
        <div class="left_box">
            <div class="avatar_edit_box">
                <AvatarEdit :avatarUrl="userInfo.userAVATAR"></AvatarEdit>
            </div>
            <div class="user_info" v-if="!editing">
                <div class="user_name">{{userInfo.userName}}</div>
                <div class="user_sign">{{userInfo.personSign}}</div>
                <div v-if="userInfo.id===userId" class="info_edit_btn" @click="editClick">个人信息修改</div>
            </div>
            <div class="info_edit_box" v-show="editing">
                <div class="data_item">昵称:</div>
                <input class="edit_input" v-model="userName">
                <div class="data_item">个性签名:</div>
                <input class="edit_input" v-model="userSign">
                <div class="edit_confirm_btn">
                    <button style="background-color: orange" @click="saveClick">保存</button>
                    <button @click="cancelCLick">取消</button>
                </div>
            </div>
            <div class="self_data" v-show="!editing">
                <div class="data_item">文章数量：{{userInfo.articleCount}}</div>
                <div class="data_item">说说数量：{{userInfo.talkCount}}</div>
                <div class="data_item">评论数量：{{userInfo.commentCount}}</div>
                <LatestComment :authorId="queryData.userId"></LatestComment>
            </div>

        </div>
        <div class="right_box">
            <TabBar :tabList="tabList" @tabClick="tabClick"></TabBar>
            <div v-if="hoverTab==='文章'" class="tab_page">
                <TagBox @tagClick="tagClick" initHover="全部" :itemList="tagList"></TagBox>
                <div v-if="!isLoading" class="blog_list">
                    <div v-for="item in articleList" :key="item.id" class="blog_item">
                        <ArticleItem :articleInfo="item"></ArticleItem>
                    </div>
                </div>
            </div>
            <div v-if="hoverTab==='说说'" class="tab_page">
                <div class="talk_item" v-for="(item,index) in talkList">
                    <TalkItem :talkInfo="item" :id="item.id"></TalkItem>
                </div>
            </div>
            <div v-if="hoverTab==='评论'" class="tab_page">
                <div class="comment_item_box" v-for="(item,index) in commentList">
                    <CommentItem :comment="item"></CommentItem>
                </div>
            </div>
            <div v-if="hoverTab==='收到评论'" class="tab_page">
                <div class="comment_item_box" v-for="(item,index) in commentList">
                    <CommentItem :comment="item"></CommentItem>
                </div>
            </div>
            <Loading v-if="isLoading"></Loading>
            <Pagination class="pagination" :total="pageNum" @pageChange="pageChange"></Pagination>
        </div>

    </div>
</template>

<script setup>
    import { doActionByAqBack } from "../../utils/ajaxService";
    import { getServer } from "../../environment/environment";
    import {debounce} from "../../utils/utilsService.ts";
    import {ref,onMounted} from "vue"
    import { ElMessage } from "element-plus";
    import { useUserStore } from "../../stores/modules/userStore";

    const userInfo=ref("");
    const editing=ref(false);
    const isLoading=ref(false);
    const userName=ref("");
    const userSign=ref("");
    const userId=ref("")
    if (useUserStore().userData.loginStatus){
      userId.value=JSON.parse(localStorage.getItem('userInfo')).userId
    }
    const tagList=ref(new Set());
    const articleList=ref([]);
    const talkList=ref([]);
    const commentList=ref([]);
    const tabList=ref(["文章","说说","评论","收到评论"]);
    const hoverTab=ref("")
    let pageNum = ref(0);

    const props=defineProps({
      userId:String
    })
    let queryData={
      userId:props.userId,
      tag:"全部",
      page: 0,
      size: 6
    }


      new Promise((resolve, reject) =>{
        doActionByAqBack(
          getServer().aquamanBackDev,
          "AqUserController",
          "getAuthor",
          queryData
        ).subscribe((response) => {
          console.log(response);
          userInfo.value=response.data;
          userName.value=response.data.userName
          userSign.value=response.data.personSign
        });
      })

    function tabClick(tab) {
      hoverTab.value=tab;
      queryData.value={
        userId:props.userId,
        tag:"全部",
        page: 0,
        size: 6
      }
      if (tab==="文章"){
        initList()
      }else {
        pageChange(1)
      }
    }
    function initList() {
      changeLoadingState();
      Promise.all([
        changeList(queryData.tag),
        initTag()
      ]).then(()=>{
        changeLoadingState();
      })
    }


    function pageChange(page) {
      queryData.page = page - 1;
      changeLoadingState();
      if (hoverTab.value==="文章"){
        articlePageChange()
      }
      if(hoverTab.value==="说说"){
        talkPageChange();
      }
      if (hoverTab.value==="评论"){
        commentPageChange();
      }
      if (hoverTab.value==="收到评论"){
        receiveCommentPageChange();
      }
    }
    function articlePageChange() {
      articleList.value=[]
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "getArticleByAuthorId",
        queryData
      ).subscribe((response) => {
        changeLoadingState();
        pageNum.value = response.data.totalPages;
        articleList.value = response.data.content;
      });
    }
    function talkPageChange() {
      talkList.value=[]
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqTalkController",
        "getTalkByPageAndUserId",
        {userId:queryData.userId,size:5,page:queryData.page}
      ).subscribe((response) => {
        changeLoadingState();
        pageNum.value = response.data.totalPage;
        talkList.value = response.data.content;
      });
    }
    function commentPageChange() {
      commentList.value=[]
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "getCommentByUserId",
        {userId:queryData.userId,page:queryData.page,size:10}
      ).subscribe((response) => {
        changeLoadingState();
        pageNum.value = response.data.pageNum;
        commentList.value = response.data.content;
      });
    }
    function receiveCommentPageChange() {
      commentList.value=[]
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "getLatestCommentByAuthorId",
        {authorId:queryData.userId,page:queryData.page,size:10}
      ).subscribe((response) => {
        changeLoadingState();
        pageNum.value = response.data.pageNum;
        commentList.value = response.data.content;
      });
    }

    function tagClick(tag) {
      changeLoadingState();
      queryData.tag=tag;
      changeList(tag).then(()=>{
        changeLoadingState();
      })
    }

    function initTag(){
      return new Promise((resolve,reject)=>{
        doActionByAqBack(
          getServer().aquamanBackDev,
          "AqArticleController",
          "getTagByUserId",
          {userId:queryData.userId}
        ).subscribe((response) => {
          console.log(response);
          tagList.value=response.data.map((tag,index)=>{
            return [tag.tagName,tag.articleNum];
          })
          resolve();
        });
      })
    }

    function changeList(prop) {
      queryData={
        userId:queryData.userId,
        tag:prop,
        page: 0,
        size: 6
      }
      return new Promise((resolve,reject)=>{
        doActionByAqBack(
          getServer().aquamanBackDev,
          "AqArticleController",
          "getArticleByAuthorId",
          queryData
        ).subscribe((response) => {
          pageNum.value = response.data.totalPages;
          articleList.value = response.data.content;
          resolve();
        });
      })
    }

    function changeLoadingState() {
      isLoading.value = !isLoading.value;
    }

    function editClick() {
      editing.value=true;
    }
    function cancelCLick() {
      editing.value=false;
      userSign.value=userInfo.value.personSign;
      userName.value=userInfo.value.userName;
    }

    const saveClick=debounce(()=>{
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqUserController",
        "userInfoUpdate",
        {userId:queryData.userId,
          userName:userName.value,
          personSign:userSign.value}
      ).subscribe((response) => {
        console.log(response);
        if (response.hasOwnProperty("status")&&response.status===200){
          ElMessage.success('修改成功');
          userInfo.value=response.data;
          userName.value=response.data.userName;
          userSign.value=response.data.personSign;
          editing.value=false;
        }else {
          ElMessage.error('修改失败');
        }

      });
    },500)

</script>

<style scoped>
@import "index.css";
</style>