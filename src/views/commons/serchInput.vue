<template>
  <div>
    <el-popover
      v-model="dialog"
      placement="right"
      width="500"
      trigger="manual">
      <!--表格渲染-->
      <el-table
        v-loading="loading"
        ref="table"
        :data="options"
        size="small"
        style="width: 100%;"
        height="350px"
        border>

        <el-table-column v-for="(item,index) in coulumns" :key="index" :prop="item.prop" :label="item.label" width="120px" @click="getItem(item)">
          <template slot-scope="scope">
            <el-link type="primary" @click="gridRowClick(scope.row)">{{ scope.row[item.prop] }}</el-link>
          </template>

        </el-table-column>
        <!-- <el-table-column>{{ this.coulumns }}</el-table-column> -->
      </el-table>
      <!--分页组件-->
      <el-input
        slot="reference"
        v-model="newValue"
        :class="desc.class"
        :style="desc.style"
        v-bind="desc.attrs"
        placeholder="输入以查询"
        size="small"
        @input="handleChange"
        @focus="handleFocus($event)"
      >
        <el-button slot="append" icon="el-icon-search" size="small" @click="showAllMaterial"/>
      </el-input>
    </el-popover>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'SerchInput',
  components: {},
  props: {
    // 传递一个label，用来显示对应列的label
    'url': { type: String, required: true },
    'coulumns': { type: Array, required: true, default() { return [{ prop: '', label: '' }] } },
    'value': { type: String, required: false, default: '' },
    'desc': { type: Object, required: false, default() { return {} } },
    'milliseconds': { type: Number, required: false, default: 500 }
  },
  data() {
    return {
      newValue: this.value,
      options: [],
      dialog: false,
      loading: true,
      columnLabel: '',
      columnprop: ''

    }
  },

  computed: {},
  watch: {
    coulumns: {
      handler(val, oldval) {
        console.log('val', val)
      },
      deep: true
    }

  },
  // columnLabel(newValue, oldValue) {
  //   if (this.coulumns.length > 0) {
  //     for (let i = 0; i < this.columns.length; i++) {
  //       console.log('columns[i]', this.columns[i].label)
  //       return this.columns[i].label
  //     }
  //   }
  // }

  created() {
    // this.$nextTick(() => {
    //   this.requestData()
    // })
  },
  mounted() {},
  updated() {
    console.log('coulumns', this.coulumns)
    // for (let i = 0; i < this.coulumns.length; i++) {
    //   this.columnLabel = this.coulumns[i].label
    //   this.columnprop = this.coulumns[i].prop
    // }
  },
  methods: {
    gridRowClick(row) {
      this.$emit('setValue', row)
      this.dialog = false
      console.log('row', row)
    },
    // getItem(column) {
    //   console.log('点击了')
    //   this.$emit('returnItem', column)
    //   this.dialog = false
    // },

    handleChange(value) {
      this.dialog = true
      this.$emit('input', value)
      if (value.trim() !== '') {
        this.loading = true
        setTimeout(() => {
          this.init(this.url)
        }, this.milliseconds)
      } else {
        this.options = []
      }
    },
    handleFocus(event) {
      event.currentTarget.select()
    },
    showAllMaterial() {

    },

    init(url) {
      this.loading = true
      request({
        url: url,
        method: 'get'
      }).then(res => {
        if (res.success) {
          this.options = res.data.content
          console.log('this.options', res.data.content)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }

  }
}
</script>

<style  scoped>

</style>
