<template>
  <el-card class="table-creator">
    <div slot="header" class="clearfix">
      <span>表格创建器</span>
      <el-select v-model="databaseType" placeholder="选择数据库类型" size="small" style="float: right; width: 120px;">
        <el-option label="MySQL" value="MySQL"></el-option>
      </el-select>
    </div>

    <el-row :gutter="20" class="import-buttons">
      <el-col :span="4">
        <el-button type="primary" @click="smartImport">智能导入</el-button>
      </el-col>
      <el-col :span="4">
        <el-upload
            class="file-uploader"
            action="#"
            :on-change="handleFileUpload"
            :auto-upload="false"
            :show-file-list="false"
            accept=".csv"
        >
          <el-button>导入 CSV</el-button>
        </el-upload>
      </el-col>
    </el-row>

    <el-form :model="formData" label-width="100px" size="small">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="库名">
            <el-input v-model="formData.databaseName" placeholder="多个单词间建议用下划线分割"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表名" required>
            <el-input v-model="formData.tableName" placeholder="test_table"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="表注释">
        <el-input v-model="formData.tableComment" type="textarea" :rows="2" placeholder="描述表的中文名称、作用等"></el-input>
      </el-form-item>

      <el-form-item label="生成条数" required>
        <el-input-number v-model="formData.generatedRows" :min="1" :max="100"></el-input-number>
      </el-form-item>

      <el-divider content-position="left">字段</el-divider>

      <div v-for="(field, index) in formData.fields" :key="index" class="field-item">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="field.name" placeholder="字段名"></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="field.type" placeholder="字段类型">
              <el-option label="VARCHAR" value="VARCHAR"></el-option>
              <el-option label="INT" value="INT"></el-option>
              <el-option label="DATETIME" value="DATETIME"></el-option>
              <el-option label="TEXT" value="TEXT"></el-option>
              <el-option label="BOOLEAN" value="BOOLEAN"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="field.length" placeholder="长度" v-if="field.type === 'VARCHAR'"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input v-model="field.comment" placeholder="注释"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" icon="el-icon-delete" circle @click="removeField(index)"></el-button>
          </el-col>
        </el-row>
      </div>

      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addNewField">新增字段</el-button>
        <el-button icon="el-icon-plus" @click="addCommonFields">新增通用字段</el-button>
        <el-button type="info" icon="el-icon-view" @click="previewTable">预览表格</el-button>
      </el-form-item>

      <el-divider></el-divider>

      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="generateAll">一键生成</el-button>
        <el-button type="success" icon="el-icon-document-add" @click="saveTable">保存表</el-button>
        <el-button type="info" icon="el-icon-document-copy" @click="copyConfig">复制配置</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- CSV Preview Dialog -->
    <el-dialog title="CSV 预览" :visible.sync="csvPreviewDialogVisible" width="80%">
      <el-table :data="csvPreviewData" style="width: 100%" max-height="400">
        <el-table-column
            v-for="column in csvColumns"
            :key="column"
            :label="column"
            :prop="column"
        >
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="csvPreviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="importCSV">导入</el-button>
      </div>
    </el-dialog>

    <!-- Table Preview Dialog -->
    <el-dialog title="表格预览" :visible.sync="tablePreviewDialogVisible" width="80%">
      <el-table :data="previewData" style="width: 100%" max-height="400">
        <el-table-column
            v-for="field in formData.fields"
            :key="field.name"
            :prop="field.name"
            :label="field.name"
        >
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- SQL Result Dialog -->
    <el-dialog title="生成的 SQL" :visible.sync="sqlDialogVisible" width="50%">
      <el-input
          type="textarea"
          :rows="10"
          v-model="sqlResult"
          readonly
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sqlDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="copySqlResult">复制 SQL</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import Papa from 'papaparse';

export default {
  name: 'TableCreator',
  data() {
    return {
      databaseType: 'MySQL',
      formData: {
        databaseName: '',
        tableName: '',
        tableComment: '',
        generatedRows: 20,
        fields: []
      },
      sqlResult: '',
      sqlDialogVisible: false,
      csvPreviewDialogVisible: false,
      csvPreviewData: [],
      csvColumns: [],
      tablePreviewDialogVisible: false,
      previewData: [],
    };
  },
  methods: {
    addNewField() {
      this.formData.fields.push({
        name: '',
        type: 'VARCHAR',
        length: 255,
        comment: ''
      });
    },
    removeField(index) {
      this.formData.fields.splice(index, 1);
    },
    addCommonFields() {
      const commonFields = [
        { name: 'id', type: 'INT', comment: '主键ID' },
        { name: 'created_at', type: 'DATETIME', comment: '创建时间' },
        { name: 'updated_at', type: 'DATETIME', comment: '更新时间' }
      ];
      this.formData.fields.push(...commonFields);
    },
    saveTable() {
      this.$message.success('表格配置已保存');
    },
    copyConfig() {
      const config = JSON.stringify(this.formData, null, 2);
      navigator.clipboard.writeText(config).then(() => {
        this.$message.success('配置已复制到剪贴板');
      });
    },
    resetForm() {
      this.formData = {
        databaseName: '',
        tableName: '',
        tableComment: '',
        generatedRows: 20,
        fields: []
      };
    },
    copySqlResult() {
      navigator.clipboard.writeText(this.sqlResult).then(() => {
        this.$message.success('SQL 已复制到剪贴板');
      });
    },
    smartImport() {
      this.$message.info('智能导入功能待实现');
    },
    handleFileUpload(file) {
      if (file.raw.type !== 'text/csv') {
        this.$message.error('请上传 CSV 文件');
        return;
      }

      Papa.parse(file.raw, {
        complete: (results) => {
          this.csvPreviewData = results.data.slice(0, 10); // Preview first 10 rows
          this.csvColumns = Object.keys(this.csvPreviewData[0]);
          this.csvPreviewDialogVisible = true;
        },
        header: true
      });
    },
    importCSV() {
      this.formData.fields = this.csvColumns.map(column => ({
        name: column,
        type: this.guessFieldType(column, this.csvPreviewData),
        length: 255,
        comment: ''
      }));
      this.csvPreviewDialogVisible = false;
      this.$message.success(`已导入 ${this.csvColumns.length} 个字段`);
    },
    guessFieldType(columnName, data) {
      const sample = data[0][columnName];
      if (typeof sample === 'number') {
        return 'INT';
      } else if (typeof sample === 'boolean') {
        return 'BOOLEAN';
      } else if (sample instanceof Date) {
        return 'DATETIME';
      } else {
        return 'VARCHAR';
      }
    },
    generateAll() {
      const createTableSQL = this.generateSQL();
      const insertDataSQL = this.generateInsertSQL();
      this.sqlResult = createTableSQL + '\n\n' + insertDataSQL;
      this.sqlDialogVisible = true;
    },
    generateSQL() {
      let sql = `CREATE TABLE IF NOT EXISTS \`${this.formData.tableName}\` (\n`;
      this.formData.fields.forEach((field, index) => {
        sql += `  \`${field.name}\` ${field.type}`;
        if (field.type === 'VARCHAR') sql += `(${field.length})`;
        if (field.comment) sql += ` COMMENT '${field.comment}'`;
        if (index < this.formData.fields.length - 1) sql += ',';
        sql += '\n';
      });
      sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${this.formData.tableComment}';`;
      return sql;
    },
    generateInsertSQL() {
      const fieldNames = this.formData.fields.map(field => field.name).join(', ');
      let insertSQL = `INSERT INTO \`${this.formData.tableName}\` (${fieldNames}) VALUES\n`;

      for (let i = 0; i < this.formData.generatedRows; i++) {
        const values = this.formData.fields.map(field => this.generateMockData(field));
        insertSQL += `(${values.join(', ')})`;
        if (i < this.formData.generatedRows - 1) {
          insertSQL += ',\n';
        } else {
          insertSQL += ';';
        }
      }

      return insertSQL;
    },
    generateMockData(field) {
      switch (field.type) {
        case 'VARCHAR':
          return `'${this.generateRandomString(Math.min(field.length, 10))}'`;
        case 'INT':
          return Math.floor(Math.random() * 1000);
        case 'DATETIME':
          return `'${new Date().toISOString().slice(0, 19).replace('T', ' ')}'`;
        case 'TEXT':
          return `'${this.generateRandomString(20)}'`;
        case 'BOOLEAN':
          return Math.random() > 0.5 ? 'TRUE' : 'FALSE';
        default:
          return 'NULL';
      }
    },
    generateRandomString(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    previewTable() {
      this.previewData = this.generatePreviewData();
      this.tablePreviewDialogVisible = true;
    },

    generatePreviewData() {
      const previewRows = 5; // 预览的行数
      let data = [];
      for (let i = 0; i < previewRows; i++) {
        let row = {};
        this.formData.fields.forEach(field => {
          row[field.name] = this.generateMockData(field);
        });
        data.push(row);
      }
      return data;
    },
  }
};
</script>

<style scoped>
.table-creator {
  max-width: 1000px;
  margin: 20px auto;
}
.import-buttons {
  margin-bottom: 20px;
}
.field-item {
  margin-bottom: 15px;
}
.el-divider {
  margin: 20px 0;
}
</style>