<template>
  <div class="roles">
    <!-- 面包屑列表 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" @click="tianDialogFormVisible = true">添加按钮</el-button>
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
                @close="cnt=0;delRight(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="cnt=0;delRight(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'error'"
                    v-for="houmian in second.children"
                    :key="houmian.id"
                    style="margin-right:5px;margin-top:5px"
                    @close="cnt=0;delRight(scope.row,houmian.id)"
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
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="userRedact(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="shanById"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 权限的分配 -->
    <el-dialog title="权限分配" :visible.sync="grantdialogTableVisible">
      <el-tree
        :data="rightList"
        ref="tree"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="chkedArr"
        :props="defaultProps"
      ></el-tree>
       <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户 -->

     <el-dialog title="添加页面" :visible.sync="tianDialogFormVisible">
  <el-form :model="addRole" :label-width="'80px'" ref="jiaUser">
    <el-form-item label="姓名" prop="roleName">
      <el-input v-model="addRole.roleName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="职位" prop="roleDesc">
      <el-input v-model="addRole.roleDesc" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="tianDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="jiaUser">确 定</el-button>
    </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑页面" :visible.sync="bianDialogFormVisible">
  <el-form :model="compileform" :label-width="'80px'" ref="compileform">
    <el-form-item label="姓名" prop="roleName">
      <el-input v-model="compileform.roleName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="职位" prop="roleDesc">
      <el-input v-model="compileform.roleDesc" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="bianDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="compileForm">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>
<script>
import { getAllRoleList, delRightsById, addRoleList, grantRolsById, compileUserList } from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      roleId: '',
      cnt: 0,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      rightList: [],
      rolelist: [],
      chkedArr: [],
      grantdialogTableVisible: false,
      bianDialogFormVisible: false,
      tianDialogFormVisible: false,
      bianjiForm: {
        roleName: '',
        roleDesc: ''
      },
      addRole: {
        roleName: '',
        roleDesc: ''
      },
      compileform: {
        id: '',
        roleName: '',
        roleDesc: ''
      }
    }
  },
  mounted () {
    this.init()
    getAllRightList('tree').then(res => {
      this.rightList = res.data.data
    })
  },
  methods: {
    // 获取当前的授权
    showGrantDialog (row) {
      // 获取id
      this.roleId = row.id
      this.grantdialogTableVisible = true
      // 深拷贝
      this.rightList = [...this.rightList]
      this.chkedArr.length = 0
      // 获取当前id的权限添加到chkedArr里面
      // 我们只需要获取到最后一段即可
      row.children.forEach(first => {
        // 拿到一级权限里面的二级权限的id
        if (first.children.length > 0) {
          first.children.forEach(second => {
            if (second.children.length > 0) {
              // 通过遍历拿到二级权限里面的三级权限id
              second.children.forEach(houmian => {
                this.chkedArr.push(houmian.id)
              })
            }
          })
        }
      })
    },
    // 给角色添加权限
    // async:标记这个函数中会有异步操作
    async grantRole () {
      // getCheckedNodes是elemet内置写法
      // 现获取到当前用户所选择的所有id,并以逗号来分隔的字符串
      let arr = this.$refs.tree.getCheckedNodes()
      let temp = []
      // 遍历数组,进行数据的拼接
      for (let i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      // 拼接数组元素在转换为数组
      temp = temp.join(',').split(',')
      // 数组去重new Set(数组)可以去除数组中重复的数据,他的返回值是以个set对象
      temp = [...new Set(temp)]
      // await：这个关键字是标记后面的是异步操作，我们需要等待这个异步操作执行完毕之后，才进行下一步行为
      // await必须写在async中，并且async只能加给当前await所在的函数
      let res = await grantRolsById(this.roleId, temp.join(','))
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.grantdialogTableVisible = false
        this.init()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 添加用户
    jiaUser () {
      console.log(this.addRole)
      this.$refs.jiaUser.validate(valid => {
        addRoleList(this.addRole)
          .then(res => {
            console.log(res)
            if (res.data.meta.status === 201) {
              this.$message.success('添加成功')
              this.tianDialogFormVisible = false
              this.init()
            }
          })
          .catch(() => {
            this.$message.success('添加失败')
          })
      })
    },
    // 获取编辑用户的数据
    userRedact (row) {
      // console.log(row)
      this.bianDialogFormVisible = true
      this.compileform.id = row.id
      this.compileform.roleName = row.roleName
      this.compileform.roleDesc = row.roleDesc
    },
    // 编辑用户的数据
    compileForm () {
      compileUserList(this.compileform.id, this.compileform)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.compileform = res.data.meta
            this.bianDialogFormVisible = false
            this.init()
          }
        })
        .catch(() => {
          this.$message.success('数据修改失败')
        })
    },
    shanById () {

    },

    delRight (row, rightId) {
    //   console.log(row.id, rightId)
      delRightsById(row.id, rightId)
        .then(res => {
        //   console.log(res)
          if (this.cnt === 0) {
            this.$message.success('删除角色权限成功')
            this.cnt++
          }
          row.children = res.data.data
          // 判断当前权限是否还有下一级权限,如果没有那就把当前这一级的权限也删除
          row.children.forEach((v1, in1) => {
            if (v1.children.length === 0) {
              // 说明这个一级列表没有任何二级权限
              this.delRight(row, v1.id)
            } else {
              v1.children.forEach((v2, in2) => {
                // 说明这个二级权限没有任何三级权限
                if (v2.children.length === 0) {
                  this.delRight(row, v2.id)
                }
              })
            }
          })
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
