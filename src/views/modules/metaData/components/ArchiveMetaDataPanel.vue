<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-tree
        :data="trees"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        :default-expand-all="true"
        :highlight-current="true">
      </el-tree>
    </div>
    <div class="main-content">
      <div class="toolbar">
        <el-button size="small" @click="handleAdd">新增</el-button>
        <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
        <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
      </div>

      <el-table :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="显示名称" sortable></el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span>{{typeMap[scope.row.type]}}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth">
          <el-form-item label="id" prop="id" v-show="false">
            <el-input v-model="temp.id"></el-input>
          </el-form-item>
          <el-form-item label="档案类型名称" prop="name">
            <el-input v-model="temp.name" placeholder="请输入档案类型名称"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="storeType">
            <el-select v-model="temp.storeType" placeholder="请选择">
              <el-option
                v-for="item in storeTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="整理规则">
            <el-radio-group v-model="temp.type" :disabled="dialogStatus!=='add'">
              <el-radio label="f">不立卷</el-radio>
              <el-radio label="v">立卷(案卷)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="整理方式">
            <el-radio-group v-model="temp.filingMode">
              <el-radio label="0">部门整理</el-radio>
              <el-radio label="1" :disabled="temp.type=='f'">集中整理</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上架方式">
            <el-radio-group v-model="temp.storeMode">
              <el-radio label="1" :disabled="temp.type=='f'">按卷上架</el-radio>
              <el-radio label="2">按盒上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="dialogStatus=='add'" type="primary" @click="addSave">确 定</el-button>
          <el-button v-else type="primary" @click="editSave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ArchiveMetaDataPanel'
}
</script>

<style scoped>

</style>
