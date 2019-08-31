<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
     <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="goodsobj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        @keydown.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" @click="$router.push({name: 'add'})">添加商品</el-button>
    </div>
    <!-- 列表展示区域 -->
    <el-table :data="goodslist" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="姓名"></el-table-column>
      <el-table-column prop="goods_price" label="描述"></el-table-column>
      <el-table-column prop="goods_weight" label="描述"></el-table-column>
      <el-table-column prop="add_time" label="描述"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="审核" placement="top">
            <el-button type="success" icon="el-icon-share" ></el-button>
          </el-tooltip>
          <el-tooltip class effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页列表 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="goodsobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { getAllGoodsList } from '@/api/goods_index.js'
export default {
  data () {
    return {
      goodsobj: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [],
      total: 0
    }
  },
  //   函数声明没调用的
  methods: {
    async init () {
      let res = await getAllGoodsList(this.goodsobj)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.goodslist = res.data.data.goods
        this.total = res.data.data.total
      } else if (res.data.meta.status === 401) {
        this.$message.warning(res.data.data.msg)
      }
    },
    handleSizeChange (val) {
      this.goodsobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.goodsobj.pagenum = val
      this.init()
    }
  },
  //   钩子函数 页面加载完成之后（￣︶￣）↗
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
