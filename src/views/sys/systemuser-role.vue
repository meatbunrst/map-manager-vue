<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="visible"
    title="分配角色"
    width="40%"
    center>
    <div class="row">
      <el-row :gutter="20">
        <el-col :span="12">

          <draggable
            v-model="undoList"
            class="list-group"
            draggable=".item"
            group="people"
          >
            <div
              v-for="element in undoList"
              :key="element.roleId"
              class="list-group-item item">
              {{ element.roleName }}
            </div>
            <div
              slot="header"
              class="btn-group list-group-item"
              role="group"
              aria-label="Basic example"
            >
              <el-tag>未分配角色</el-tag>
            </div>
          </draggable>
        </el-col>
        <el-col :span="12">
          <draggable
            v-model="doneList"
            class="list-group"
            group="people">
            <div
              v-for="element in doneList"
              :key="element.roleId"
              class="list-group-item item">
              {{ element.roleName }}
            </div>
            <div
              slot="header"
              class="list-group-item"
              role="group"
              aria-label="Basic example">
              <el-tag type="warning" >已分配角色</el-tag>
            </div>
          </draggable>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitData()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data() {
    return {
      userId: 0,
      undoList: [],
      doneList: [],
      visible: false,
      filterText: '',
      drag: false
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    init(id) {
      this.userId = id
      this.visible = true
      this.undoList = []
      this.doneList = []
      this.$http.get(this.$http.adornUrl(`/sysrole/dragData`), { params: this.$http.adornParams({ userId: id }) }).then(({ data }) => {
        if (data && data.code === 0) {
          this.undoList = data.undo
          this.doneList = data.done
        }
      })
    },
    submitData() {
      this.visible = false
      this.$http.post(this.$http.adornUrl(`/sysrole/assignment`), this.$http.adornData({ userId: this.userId, roleEntities: this.doneList })).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    log: function(evt) {
      window.console.log(evt)
    }
  }
}
</script>
<style>
  .row{
    max-height: 800px;
  }
  .list-group-item {
    position: relative;
    display: block;
    padding: .75rem 1.25rem;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.125);
    cursor: move;
  }
  .list-group {
    min-height: 20px;
    height: 500px;
    overflow: auto;
  }
  .list-group-item i {
    cursor: pointer;
  }

  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
</style>
