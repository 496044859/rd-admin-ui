<template>
  <section>
    <el-dialog :title="textMap[dialogVisible.dialogStatus]" :visible.sync="dialogVisible.extractFile" width="1200px" :close-on-click-modal="false">
      <section>
        <section>
          <div class="toolbar">
            <el-badge :value="number" class="item">
              <el-button size="small" @click="goToBorrowBus">待提取数据</el-button>
            </el-badge>
          </div>
          <div>
            <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" highlight-current-row stripe style="width: 100%">
              <grid-col-item v-for="col in colModel" :item="col" :key="col.sxmc"></grid-col-item>
              <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="addToBorrowBus(scope.row)">加入待鉴定</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </section>
      </section>
      <el-dialog width="60%" title="待鉴定数据" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
        <el-table :data="inlist" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row style="width: 100%">
          <el-table-column prop="dalxid" label="档案类型">
            <template slot-scope="scope">
              {{scope.row.dalxid | formatArchiveType}}
            </template>
          </el-table-column>
          <el-table-column prop="gdh" label="档号">
            <template slot-scope="scope">
              <span v-html="scope.row.gdh"></span>
            </template>
          </el-table-column>
          <el-table-column prop="tm" label="题名">
            <template slot-scope="scope">
              <span v-html="scope.row.tm"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="delIn(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible=false">关闭</el-button>
          <el-button type="primary" @click="add" :disabled="this.inlist.length===0">添加</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.extractFile=false">关闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { pastedArchivePage, addItemList, destructionFileNames } from '@/api/judge'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'
export default{
  name: 'ExtractFile',
  components: {
    GridColItem
  },
  props: {
    dialogVisible: {
      type: Object
    },
    config: {
      type: Object
    }
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb
      },
      textMap: {
        extract: '超期文件列表',
        destructions: '超期销毁列表'
      },
      innerVisible: false,
      list: [],
      inlist: [],
      colModel: [],
      groups: [],
      multipleSelection: [],
      loading: false,
      total: null,
      number: 0
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  watch: {
    'inlist.length': {
      handler (val) {
        if (val) {
          this.number = val
        } else {
          this.number = 0
        }
      },
      deep: true
    },
    'dialogVisible.extractFile': {
      handler (val) {
        if (val === true) {
          this.getFileName()
        }
      },
      deep: true
    }
  },
  methods: {
    getList () {
      this.loading = true
      if (this.dialogVisible.dialogStatus === 'extract') {
        pastedArchivePage(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalCount
          this.loading = false
        })
      } else {
        destructionFileNames(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalCount
          this.loading = false
        })
      }
    },
    getFileName () {
      const colQuery = {
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        mkid: this.config.mkid
      }
      fetchDefineNames(colQuery).then(response => {
        this.colModel = response.data
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    addToBorrowBus (row) { // 加入检索车
      const a = this.inlist.findIndex(item => item.id === row.id)
      if (a < 0) {
        this.inlist = [...this.inlist, row]
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '数据已存在，不能重复添加',
          type: 'error'
        })
      }
    },
    delIn (row) {
      const index = this.inlist.findIndex(item => item.F_ID === row.F_ID)
      this.inlist.splice(index, 1)
    },
    goToBorrowBus () { // 检索车
      this.innerVisible = true
    },
    add () {
      const ids = this.inlist.map(item => item.id).join()
      const addList = {
        ids: ids,
        id: this.config.id,
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        jdmd: this.config.jdmd
      }
      addItemList(addList).then(response => {
        this.innerVisible = false
        this.dialogVisible.extractFile = false
        this.inlist = []
        this.$emit('refresh')
        this.$message({
          message: '新增成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style solt-scoped>
</style>
