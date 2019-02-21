<template>
  <section>
    <div>
        <div class="toolbar">
          <el-dropdown v-if="this.config.yjfs==='1'">
            <el-button size="small">
              电子档案移交<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleElectron('query')">移交检索结果</el-dropdown-item>
              <el-dropdown-item @click.native="handleElectron('select')" :disabled="this.multipleSelection.length===0">移交所选记录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown v-if="this.config.yjfs==='1'">
            <el-button size="small">
              实体移交<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleEntity('query')">移交检索结果</el-dropdown-item>
              <el-dropdown-item @click.native="handleEntity('select')" :disabled="this.multipleSelection.length===0">移交所选记录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown v-if="this.config.yjfs==='0'">
            <el-button size="small">
              电子档案移交<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleElectron('query')">移交检索结果</el-dropdown-item>
              <el-dropdown-item @click.native="handleElectron('select')" :disabled="this.multipleSelection.length===0">移交所选记录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown v-if="this.config.yjfs==='0'">
            <el-button size="small">
              实体移交<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleEntity('query')">移交检索结果</el-dropdown-item>
              <el-dropdown-item @click.native="handleEntity('select')" :disabled="this.multipleSelection.length===0">移交所选记录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <div class="right-group">
            <label class="status-text">电子档案状态：</label>
            <el-select v-model="listQuery.docYjStatus" @change="handleFilter" placeholder="请选择" size="small" style="width: 100px;">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <label class="status-text">实体状态：</label>
            <el-select v-model="listQuery.entityJgStatus" @change="handleFilter" placeholder="请选择" size="small" style="width: 100px;">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input placeholder="请输入检索关键字" v-model="listQuery.integrativeQueryValue" class="input-with-select" size="small" style="width: 200px;">
              <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
            </el-input>
          </div>
        </div>

        <div class="table-list">
          <el-table :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" stripe highlight-current-row style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <grid-col-item v-for="col in colModel" :item="col" :key="col.propertyName"></grid-col-item>
            <el-table-column prop="docYj" label="电子档案移交" sortable :formatter="typeDocYj">
            </el-table-column>
            <el-table-column prop="entityYj" label="实体移交" sortable :formatter="typeEntityJg">
            </el-table-column>
          </el-table>
        </div>

        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
    </div>
    <!-- <Internal-Transfer :transferQuery="transferQuery" :type="type" @save="save"></Internal-Transfer> -->
    <HandOver-UpLoad :handOverUpLoadQuery="handOverUpLoadQuery"></HandOver-UpLoad>
  </section>
</template>

<script>
import { fetchGridData, handOver } from '@/api/file'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'
// import InternalTransfer from './InternaTransfer'
import HandOverUpLoad from './HandOverUpLoad'

export default {
  name: 'handOver_folderInside', // 档案移交-文件层
  components: {
    GridColItem,
    // InternalTransfer,
    HandOverUpLoad
  },
  data () {
    return {
      config: this.$route.query,
      isShow: false,
      colQuery: {
        dalxid: '',
        kdlb: '',
        mkid: 'YJ'
      },
      listQuery: {
        page: 1,
        limit: 10,
        mkid: 'YJ',
        yjfs: '',
        zt: '13',
        docYjStatus: '',
        entityJgStatus: '',
        integrativeQueryValue: ''
      },
      statusOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '未移交'
      }, {
        value: '1',
        label: '已移交'
      }],
      multipleSelection: [],
      listLoading: false,
      colModel: [],
      list: [],
      total: null,
      handOverUpLoadQuery: {
        dialogVisible: false
      },
      bgdw: '',
      type: ''
    }
  },
  created () {
    this.getColNames()
    this.getList()
  },
  methods: {
    typeDocYj (row, column) {
      return (row.docYj === false ? '未移交' : '已移交')
    },
    typeEntityJg (row, column) {
      return (row.entityYj === false ? '未移交' : '已移交')
    },
    getColNames () {
      this.colQuery.dalxid = this.config.dalxid
      this.colQuery.kdlb = this.config.kdlb
      fetchDefineNames(this.colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getList () {
      this.listQuery.dalxid = this.config.dalxid
      this.listQuery.kdlb = this.config.kdlb
      this.listQuery.dasid = this.config.dasid
      this.listQuery.mkid = this.config.mkid
      this.listQuery.yjfs = this.config.yjfs
      this.listQuery.queryProperty = '全部'
      this.listLoading = true
      fetchGridData(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleElectron (data) {
      this.config.yjlx = '1'
      this.type = '1'
      if (data === 'query') {
        this.isQuery = true
      } else if (data === 'select') {
        this.isQuery = false
      }
      this.handOver()
    },
    handleEntity (data) {
      this.config.yjlx = '2'
      this.type = '2'
      if (data === 'query') {
        this.isQuery = true
      } else if (data === 'select') {
        this.isQuery = false
      }
      this.handOver()
    },
    handOver () {
      let ids = ''
      if (this.isQuery) {
        ids = ''
      } else {
        ids = this.multipleSelection.map(item => item.id).join()
      }
      const params = {
        yjlx: this.config.yjlx,
        dalxid: this.config.dalxid,
        fondsId: '',
        kdlb: this.config.kdlb,
        mkid: this.config.mkid,
        dasid: this.config.dasid,
        yjfs: this.config.yjfs,
        ids: ids,
        zt: this.listQuery.zt,
        docYjStatus: this.listQuery.docYjStatus,
        entityJgStatus: this.listQuery.entityJgStatus,
        integrativeQueryValue: this.listQuery.integrativeQueryValue,
        bgdw: this.listQuery.bgdw
      }
      handOver(params).then(() => {
        this.getList()
        this.$message({
          message: '移交成功',
          type: 'success'
        })
        this.handOverUpLoadQuery.dialogVisible = true
      })
    }
  }
}
</script>

<style scoped>
  .status-text {
    font-size: 14px;
    margin-left: 10px;
  }
</style>
