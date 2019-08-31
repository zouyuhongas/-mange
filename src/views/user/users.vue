<template>
        <!-- 面包屑列表 -->
        <div class="user">
            <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>活动管理</el-breadcrumb-item>
  <el-breadcrumb-item>活动详情</el-breadcrumb-item>
</el-breadcrumb>
<div style="margin-top: 15px;">
  <el-input
   placeholder="请输入内容"
   v-model="userobj.query"
   style="width:300px;margin-right:10px"
   @keydown.enter.native="init"
   class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
  </el-input>
  <el-button type="success" @click="addDialogFormVisible = true">添加用户</el-button>
  </div>
  <el-table border :data="userList" style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="250"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="350"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope='scope'>
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
          @change="changeState(scope.row.id,scope.row.mg_state)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="deluser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加页面 -->
<el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
  <el-form :model="addForm" :label-width="'80px'" :rules="rules" ref="addForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.username" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="addForm.password" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="addForm.email" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
  </div>
</el-dialog>
  <!-- 编辑用户信息页面 -->
<el-dialog title="编辑页面" :visible.sync="editDialogFormVisible">
  <el-form :model="editForm" :label-width="'80px'" :rules="rules" ref="editForm">
    <el-form-item label="用户名" prop="editname">
      <el-input v-model="editForm.username" auto-complete="off" disabled style="width:80px"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="editForm.email" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="edituser">确 定</el-button>
  </div>
</el-dialog>
<!-- 分配角色 -->
<el-dialog title="角色分配" :visible.sync="granDialogFormVisible">
      <el-form :model="grantForm" :label-width="'80px'">
        <el-form-item label="用户名：">
          <!-- <el-input v-model="grantForm.username" autocomplete="off" disabled style='width:100px'></el-input> -->
          <span>{{grantForm.username}}</span>
        </el-form-item>
        <el-form-item label="角色：">
          <!-- <el-select v-model="grantForm.rid" clearable placeholder="请选择" @change="getrid"> -->
            <el-select v-model="grantForm.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="granDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUser">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>
import { getAllUser, addUser, editUser, grantUserRole, delUserById, updataUserState } from '@/api/user_index.js'
import { getAllRoleList } from '@/api/role_index.js'
export default {
  data () {
    return {
      roleList: [],
      granDialogFormVisible: false,
      grantForm: {
        username: '',
        id: '',
        rid: ''
      },
      addDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogFormVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      total: 0,
      status: true,
      userList: [],
      userobj: {
        query: '',
        pagenum: 2,
        pagesize: 2
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            patten: /w+[@]\w+[.]\w+/,
            message: '请输入合法的电子邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^1\d{10}$/,
            message: '请输入合法手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.userobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.userobj.pagenum = val
      this.init()
    },
    init () {
      //   this.userobj中已经包含了搜索关键字
      getAllUser(this.userobj)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            this.total = res.data.data.total
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg)
            this.$router.push({ name: 'login' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    add () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message.success('用户添加成功')
                this.init()
                this.addDialogFormVisible = false
                // 重置表单属性
                this.$refs.addForm.resetFields()
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.success('用户添加失败')
            })
        } else {
          this.$message.success('请输入必填的数据')
        }
      })
    },
    showEditDialog (row) {
      this.editDialogFormVisible = true
      // console.log(row)
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    // 这是编辑页面
    edituser () {
      // 这个东西的意思是拿到这个元素里面的东西
      editUser(this.editForm)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success('编辑成功')
            this.init()
            this.editDialogFormVisible = false
            this.$refs.editForm.resetFields()
          }
        })
        .catch(() => {
          this.$message.success('编辑失败')
        })
    },
    // 打开分配角色框
    showGrantDialog (row) {
      console.log(row)
      this.granDialogFormVisible = true
      this.grantForm.username = row.username
      this.grantForm.id = row.id
      this.grantForm.rid = row.rid
    },
    // 分配角色
    grantUser () {
      // console.log(this.grantForm)
      // 要判断他是否有角色
      if (this.grantForm.rid) {
        grantUserRole(this.grantForm)
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.granDialogFormVisible = false
              // this.$refs.editForm.resetFields()
              this.init()
            }
          })
          .catch(() => {
            this.$message.success('分配失败')
          })
      } else {
        this.$message.error('请选择角色')
      }
    },
    deluser (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserById(id)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                this.$message({
                  type: ' success',
                  message: '删除成功'
                })
                // this.init()
                this.userobj.pagenum = Math.ceil((this.total - 1) / this.userobj.pagenum ? --this.userobj.pagenum : this.userobj.pagenum)
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '删除取消'
          })
        })
    },
    changeState (id, type) {
      updataUserState(id, type)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '修改状态成功'
            })
            this.init()
          } else {
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '修改状态失败'
          })
        })
    }

  },
  mounted () {
    this.init()
    getAllRoleList()
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style scoped>

</style>
