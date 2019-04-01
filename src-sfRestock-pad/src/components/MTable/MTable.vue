/* eslint-disable */
<script>
export default {
  name: 'MTable',
  props: {
    tableSource: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  render (h) {
    return h('div', {
      class: {
        'm-table': true
      }
    }, [
      this.renderTable(h)
    ])
  },
  methods: {
    renderTable (h) {
      const columns = this.columns.filter(row => !row.hidden)
      return h(
        'el-table',
        {
          props: {
            ...this.tableSource,
            data: this.data
          },
          on: {
            'cell-click': (row, column, cell, event) => {
              this.$emit('cell-click', row, column, cell, event)
            },
            'row-click': (row, event, column) => {
              this.$emit('row-click', row, event, column)
            }
          }
        },
        [
          ...columns.map(column => {
            if (column.render) {
              return h('el-table-column', {
                props: { ...column },
                scopedSlots: {
                  default: props => {
                    return column.render(h, props)
                  }
                }
              })
            } else {
              return h('el-table-column', {
                props: { ...column }
              })
            }
          })
        ]
      )
    }
  }
}
</script>

<style>
  .m-table {
    width: 100%;
  }
</style>
