<template>
<!-- eslint-disable -->
  <div class="edit">
    <div class="flex" ref="title">
      <div class="content-title">
        <div class="flex title-bar">
          <div class="title-left" @click="toBack()">
            <img src="./../../assets/images/back.svg" alt="">
          </div>
          <div class="title-center">
            <span>{{title}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content" :style="{height: height + 'px'}">
      <div class="item flex-start">
        <div class="item-l flex-start">
          <span class="fontRed">*</span><span>发货店仓</span>
        </div>
        <div class="item-r flex-start">
          <div class="btn-com" :class="{'btn-active': editform.type == 'warehouse'}" @click="onSearch('warehouse', true)" v-show="type == 'add'">仓库发货</div>
          <div class="btn-com"  :class="{'btn-active': editform.type == 'store'}" @click="onSearch('store', true)" v-show="type == 'add'">门店发货</div>
          <div class="btn-com" :class="editform.type == 'warehouse' ? 'btn-active' : 'btn-active-disable'" v-show="type == 'edit'">仓库发货</div>
          <div class="btn-com"  :class="editform.type == 'store' ? 'btn-active' : 'btn-active-disable'" v-show="type == 'edit'">门店发货</div>          
        </div>
      </div>
      <div class="item flex-start">
        <div class="item-l">
        </div>
        <div class="item-r flex-start">
          <el-select v-model="editform.source_org_id"  placeholder="请输入发货店仓">
            <el-option
              v-for="item in result"
              :key="item.source_org_id"
              :label="item.name"
              :value="item.source_org_id">
            </el-option>
          </el-select>          
        </div>
      </div>
      <div class="item flex-start">
        <div class="item-l item-l-padding ">
          <span></span><span>备注</span>
        </div>
        <div class="item-r flex-start">
          <textarea placeholder="备注信息最多可输入255个字" v-model="editform.notes"  rows="5"></textarea>
        </div>
      </div>            
    </div>
    <div class="footer" ref="footer">
      <div class="confirm edit" @click="toBack">取消</div>
      <div class="confirm" @click="goGoodsDetail" v-show="type == 'edit'">保存</div>
       <div class="confirm" @click="goGoodsDetail" v-show="type == 'add'">下一步</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import "./index.less"
import { ORG_NEIGHBOR_GET, WAREHOUSE_LIST_GET, RELOAD_UPDATE_POST } from "@/api"
import { getUrlParameter } from '../../api/util'
import { setTimeout } from 'timers';
  export default {
    name: "list",
    data() {
      return {
        height: 0,
        title: '新增补货申请单',
        type: 'add',
        result:[],
        editform: {
          type: 'warehouse',
          notes: '',
          source_org_id: ''
        }
      }
    },
    methods: {
      //离开页面
      toBack(){
        window.location.href = 'replenishApply.html?org_id=' + parseInt(window.localStorage.getItem('org_id')) + '&shop_id=' + parseInt(getUrlParameter()['shop_id'])
        window.localStorage.removeItem("applyDetailData")
      },
      // 进入下一个页面
      nextPage(){
        this.$router.push({
          name: 'editItem', params: this.editform
        })
      },
      // 仓库搜索
      warehouseSearch() {
        let that = this;
        let _data = {
            org_id: parseInt(window.localStorage.getItem('org_id')),
        };
        WAREHOUSE_LIST_GET(_data).then(res => {
          res.data.warehouses.map((item) => {
            item.name = item.warehouse_name
            item.source_org_id = item.warehouse_id
          })
          that.result = res.data.warehouses;
          that.$forceUpdate()
        });      
      }, 
      // 门店搜索
      shopSearch() {
        let that = this;
        let _data = {
            org_id: parseInt(window.localStorage.getItem('org_id')),
        };
        ORG_NEIGHBOR_GET(_data).then(res => {
          res.data.org_list.map((item) => {
            item.name = item.org_name
            item.source_org_id = item.org_id
          })        
          that.result = res.data.org_list;
          that.$forceUpdate()
        });      
      },               
      goGoodsDetail() {
        if(this.editform.source_org_id === '') {
          this.$toast({
            message: '请选择发货店仓',
            iconClass: 'icon icon-warning'
          })
          return false        
        }
        let data = {
          type: this.editform.type,
          notes: this.editform.notes,
          source_org_id: this.editform.source_org_id,
          target_org_id: parseInt(window.localStorage.getItem('org_id'))
        }
        if(this.editform.reload_no != "" && this.editform.reload_id != "" ) {
          data.reload_no = this.editform.reload_no
          data.reload_id = this.editform.reload_id
        }
        this.save(data)   
      },
      // 切换仓库发货和门店发货
      onSearch(type, flag) {
        if(flag) {
           this.editform.source_org_id = ''
        }
        if(type) {
          this.editform.type = type
        }
        if(this.editform.type == 'warehouse') {
          this.warehouseSearch()
        }else {
          this.shopSearch()
        }
      },    
      save(data) {
        let that = this
        RELOAD_UPDATE_POST(data).then(res => {
          that.$toast({
            message: '保存成功',
            iconClass: 'icon icon-success',
            className: 'successClass'
          })
          if(that.type == 'edit') {
            setTimeout(() => {
              that.toBack();
            },1000)
          }else {
            setTimeout(() => {
              window.location.href = 'pad-reload-apply.html?reload_no=' + res.data.reload_no + '&reload_id=' + res.data.reload_id + '&shop_id=' + (getUrlParameter()['shop_id']) + '&org_id=' + parseInt(window.localStorage.getItem('org_id'))
            },1000)
          }
        })      
      }      
    },
    components: {},
    created(){
      setTimeout(() => {
        try{
          _paq.push(['setCustomUrl',window.location.href]);
          _paq.push(['setDocumentTitle',window.document.title]);
          _paq.push(['trackPageView']);      
        }
        catch(err){
          console.log(err)
        }    
      }, 1200);      
    },
    mounted() {
      var screabHeight = window.innerHeight
      this.height = screabHeight -  this.$refs.title.offsetHeight - this.$refs.footer.offsetHeight
      if(window.localStorage.getItem('applyDetailData')) {
        this.editform = JSON.parse(window.localStorage.getItem('applyDetailData'))
        this.title = '编辑补货申请单'
        this.type = 'edit'
        this.editform.name = JSON.parse(window.localStorage.getItem('applyDetailData')).source_org_name
      }
      let type = this.editform.type ? this.editform.type : 'warehouse'
      this.onSearch(type, false)
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->