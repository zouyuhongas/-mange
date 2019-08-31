<template>
    <div class="goods">
          <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-steps :active="activeName-0" finish-status="success">
  <el-step title="步骤 1"></el-step>
  <el-step title="步骤 2"></el-step>
  <el-step title="步骤 3"></el-step>
  <el-step title="步骤 4"></el-step>
  <el-step title="步骤 5"></el-step>
</el-steps>
 <el-card class="box-card">
      <!-- 表单 -->
      <el-form label-width="140px">
        <!-- 标签页 -->
        <el-tabs v-model="activeName"
         tab-position="left"
          @tab-click="handClick" :before-leave="beforeLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader :options="cateList" change-on-select :props='cascadeProps'  v-model='goodsForm.goods_cat'></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-checkbox-group
              v-model="item.attr_vals"
              v-for="item in attrValues"
              :key="item.attr_id"
            >
              <el-checkbox
                border
                :label="subitem"
                v-for="(subitem,index) in item.attr_vals"
                :key="index"
              ></el-checkbox>
              </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for='item in staticValues' :key='item.attr_id'>
              <el-input :value='item.attr_vals' readonly></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
           class="upload-demo"
           :headers="setToken()"
           action="http://localhost:8888/api/private/v1/upload"
           :on-preview="handlePreview"
           :on-remove="handleRemove"
           :on-success='handleSuccess'
           :before-upload='beforeUpload'
           :file-list="fileList"
           list-type="picture"
           accept="image/gif, image/jpeg"
           >
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
            </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容
            <quillEditor v-model='goodsForm.goods_introduce'></quillEditor>
          </el-tab-pane>
        </el-tabs>
        <!-- 按钮 -->
        <el-button type="primary" @click='addGoods' style="float:right;margin-top:50px">提交按钮</el-button>
      </el-form>
    </el-card>
    </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { getAllGoodslist } from '@/api/cate_index.js'
import { getAllParamsList } from '@/api/pamars_index.js'
import { addGoods } from '@/api/goods_index.js'
export default {
  data () {
    return {
      attrValues: [], // 动态参数数组，它应该是一个对象数组，包含着所有组的参数数据
      staticValues: [],
      fileList: [],
      cateList: [],
      cascadeProps: {
        label: 'cat_name', // 展示的数据
        value: 'cat_id', // 获取的数据
        children: 'children', // 如何查询下一级数据
        activeName: '0'
      },
      goodsForm: {
        goods_name: '',
        goods_weight: '',
        goods_price: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      }
    }
  },
  components: {
    quillEditor
  },
  methods: {
    async handClick () {
      // Promise
      // 如果actvename为1,那么应该动态获取数据,如果actvename为2则获取静态数据
      if (this.activeName === '1') {
        let res = await getAllParamsList(this.goodsForm.goods_cat[2], 'many')
        this.attrValues = res.data.data
        for (var i = 0; i < this.activeName.length; i++) {
          this.activeName[i].attr_vals = this.attrValues[i].attr_vals.split(',')
        }
      } else if (this.activeName === '2') {
        let res = await getAllParamsList(this.goodsForm.goods_cat[2], 'only')
        console.log(res)
        this.staticValues = res.data.data
      }
    },
    // 标签页面跳转之前触发的钩子
    beforeLeave (activeName, oldActiveName) {
      if (activeName === '1' || activeName === '2') {
        if (this.goodsForm.goods_cat.length !== '3') {
          this.$message.warning('请选择分类')
          this.activeName = '0'
          return false
        }
      }
    },
    // 删除图片,同事删除数据
    handleRemove (file, fileList) {
      // console.log(file, fileList)
      // file就是当前被你移除的图片对象
    // 我们需要获取这个被移除的图片对象，将对应名称的数据从goods_form中删除
      var temp = file.response.data.tmp_path
      for (var i = 0; i < this.goodsForm.pics.length; i++) {
        if (this.goodsForm.pics[i].pic === temp) {
          this.goodsForm.pics.splice(i, 1)
          break
        }
      }
    },
    // 文件上传前的钩子
    beforeUpload (file) {
      // console.log(file)
      if (file.type.indexOf('image/') !== 0) {
        this.$message.warning('请选择正确的图片文件上传如png,jpg,jpeg')
      }
    },
    // 文件上传成的钩子
    handleSuccess (response, file, fileList) {
      // console.log(response, file, fileList)
      if (response.meta.status === 200) {
        // response包含了我们需要的文件上传成功之后服务器端的存储路径
        this.goodsForm.pics.push({ pic: response.data.tmp_path })
      }
    },

    // 文件上传的token值设置
    setToken () {
      var token = localStorage.getItem('itcast_manager_35_token')
      return { Authorization: token }
    },
    async addGoods () {
      // 遍历数组
      for (var i = 0; i < this.attrValues.length; i++) {
        let id = this.attrValues[i].attr.id
        for (var j = 0; j < this.attrValues[i].attr_vals.length; j++) {
          this.goodsForm.attrs.push({
            attr_id: id,
            attr_vals: this.attrValues[i].attr_vals[j]
          })
        }
      }
      this.goodsForm.goods_cat = this.goodsForm.goods_cat.join(',')
      let res = await addGoods(this.goodsForm)
      if (res.data.meta.status === 201) {
        this.$message.success('图片添加成功')
      }
    },
    handlePreview () {

    }
  },
  mounted () {
    getAllGoodslist(3)
      .then(res => {
        // console.log(res)
        this.cateList = res.data.data
      })
  }
}
</script>
<style lang="less" scoped>

</style>
