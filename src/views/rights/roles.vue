<template>
  <div class="roles">
    <!-- 面包屑列表 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success">添加按钮</el-button>
    <!-- 表格 -->
    <el-table :data="rolelist" border style="width: 100%;margin-top:15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- <h3>这个内容在我们的项目中需要我们自己来生成</h3> -->
          <el-row v-for="first in scope.row.children" :key="first.id" style="margin-bottom:15px;">
            <el-col :span="4">
              <el-tag
                closable
                :type="'success'"
                @close="delRight(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="delRight(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'error'"
                    v-for="houmian in second.children"
                    :key="houmian.id"
                    style="margin-right:5px;margin-top:5px"
                    @close="delRight(scope.row,houmian.id)"
                  >{{houmian.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length === 0">还没有任何的权限，先分配！！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="姓名"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作" width="400">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share" @click="grantdialogTableVisible = true"></el-button>
          </el-tooltip>
          <el-tooltip class effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
      </el-table-column>
    </el-table>
    <!-- 权限的分配 -->
    <el-dialog title="权限分配" :visible.sync="grantdialogTableVisible">
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="chkedArr"
        :props="defaultProps"
      ></el-tree>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRoleList, delRightsById } from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      rightList: [],
      rolelist: [],
      chkedArr: [],
      grantdialogTableVisible: false
    }
  },
  mounted () {
    this.init()
    getAllRightList('tree').then(res => {
      this.rightList = res.data.data
    })
  },
  methods: {
    delRight (row, rightId) {
    //   console.log(row.id, rightId)
      delRightsById(row.id, rightId)
        .then(res => {
        //   console.log(res)
          row.children = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    init () {
      getAllRoleList()
        .then(res => {
        //   console.log(res)
          if (res.data.meta.status === 200) {
            this.rolelist = res.data.data
          }
        })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
