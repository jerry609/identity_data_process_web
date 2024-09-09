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
        <el-upload
            class="file-uploader"
            action="#"
            :on-change="handleFileUpload"
            :auto-upload="false"
            :show-file-list="false"
            accept=".csv"
        >
          <el-button type="primary">导入文件</el-button>
        </el-upload>
      </el-col>
      <el-col :span="4" v-if="csvData.length > 0">
        <el-button @click="previewImportedData">预览导入数据</el-button>
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
        <el-input v-model="formData.tableComment" type="textarea" :rows="2"
                  placeholder="描述表的中文名称、作用等"></el-input>
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
        <!--        <el-button type="info" icon="el-icon-view" @click="previewTable">预览表格</el-button>-->
      </el-form-item>


      <el-divider></el-divider>
      <el-form-item>
        <!-- 生成并执行SQL -->
        <el-button type="primary" icon="el-icon-s-operation" @click="generateAndExecuteSQL">生成并执行SQL</el-button>

        <!-- 生成模拟数据 -->
        <el-button type="warning" icon="el-icon-s-data" @click="generateAndExecuteMockData" :disabled="!tableCreated">
          生成模拟数据
        </el-button>

        <!-- 导入文件数据 -->
        <el-button type="warning" icon="el-icon-upload" @click="importFileData" :disabled="!tableCreated">
          导入文件数据
        </el-button>

        <!-- 复制配置 -->
        <el-button type="success" icon="el-icon-document" @click="copyConfig">复制配置</el-button>

        <!-- 重置 -->
        <el-button icon="el-icon-refresh-left" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- Imported Data Preview Dialog -->
    <el-dialog title="导入数据预览" :visible.sync="importedDataPreviewVisible" width="80%">
      <el-table :data="csvData.slice(0, 10)" style="width: 100%" max-height="400">
        <el-table-column
            v-for="column in csvColumns"
            :key="column"
            :label="column"
            :prop="column"
        >
        </el-table-column>
      </el-table>
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
    <el-dialog title="生成的 SQL" :visible.sync="sqlDialogVisible" width="80%">
      <el-input
          type="textarea"
          :rows="15"
          v-model="sqlResult"
          :autosize="{ minRows: 10, maxRows: 30 }"
      ></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="sqlDialogVisible = false">关闭</el-button>
    <el-button type="primary" @click="copySqlResult">复制 SQL</el-button>
    <el-button type="success" @click="executeSQL">执行 SQL</el-button>
  </span>
    </el-dialog>
<!--    <el-dialog title="选择要导入的字段" :visible.sync="fieldSelectionDialogVisible">-->
<!--      <el-checkbox-group v-model="selectedFields">-->
<!--        <el-checkbox v-for="field in csvColumns" :key="field" :label="field">-->
<!--          {{ field }}-->
<!--        </el-checkbox>-->
<!--      </el-checkbox-group>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--    <el-button @click="fieldSelectionDialogVisible = false">取消</el-button>-->
<!--    <el-button type="primary" @click="confirmFieldSelection">确定</el-button>-->
<!--  </span>-->
<!--    </el-dialog>-->

    <el-dialog title="选择要导入的字段" :visible.sync="fieldSelectionDialogVisible">
      <el-checkbox-group v-model="selectedFields">
        <el-checkbox v-for="field in csvColumns" :key="field" :label="field">
          {{ field }}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
    <el-button @click="fieldSelectionDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="confirmFieldSelection">确定</el-button>
  </span>
    </el-dialog>
  </el-card>
</template>

<script>
import Papa from 'papaparse';
import axios from 'axios';

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
      tablePreviewDialogVisible: false,
      previewData: [],
      csvData: [],
      csvColumns: [],
      importedDataPreviewVisible: false,
      fieldSelectionDialogVisible: false,
      selectedFields: [],
      tableCreated: false,
      sqlGenerated: false,
      fileName: '',
      // 新增：用于存储上传文件的名称
    };
  },
  methods: {

    uploadSelectedData() {
      // 实现上传选中数据的逻辑
      console.log('Uploading selected data:', this.selectedFields);
      // 这里可以添加实际的上传逻辑,比如发送 API 请求等

      // 上传完成后关闭对话框
      this.fieldSelectionDialogVisible = false;

      // 可以添加成功提示
      this.$message.success('数据上传成功');
    },

    async generateAndExecuteSQL() {
      try {
        const createTableSQL = this.generateCreateTableSQL();
        this.sqlResult = createTableSQL; // 将生成的 SQL 赋值给 sqlResult
        this.sqlDialogVisible = true; // 显示对话框
        this.tableCreated = false; // 重置表创建状态
      } catch (error) {
        console.error('SQL生成错误:', error);
        this.$message.error('SQL生成失败: ' + error.message);
      }
    },
    async generateAndExecuteMockData() {
      if (!this.tableCreated) {
        this.$message.warning('请先创建表格');
        return;
      }
      this.sqlResult = this.generateInsertSQL();
      this.sqlDialogVisible = true;
    },
    async executeSql() {
      try {
        const response = await axios.post('/api/execute-sql', this.sqlResult);
        this.$message.success(response.data);
        this.tableCreated = true;
        this.sqlDialogVisible = false;
      } catch (error) {
        this.$message.error('SQL执行失败: ' + (error.response?.data || error.message));
      }
    },

    // 数据输入选择
    handleFileUpload(file) {
      if (file.raw.type !== 'text/csv') {
        this.$message.error('请上传 CSV 文件');
        return;
      }

      // 保存文件名，去掉 .csv 扩展名
      this.fileName = file.name.replace(/\.csv$/i, '');

      Papa.parse(file.raw, {
        complete: (results) => {
          this.csvData = results.data;
          this.csvColumns = Object.keys(this.csvData[0]);
          this.$message.success('文件导入成功');
          this.preprocessData();
          // this.fieldSelectionDialogVisible = true; // 打开字段选择对话框
        },
        header: true

      });
    },

    // 数据预处理
    preprocessData() {
      this.cleanData();
      this.handleMissingValues();
      this.convertDataTypes();
      this.normalizeFieldNames();
      this.updateFieldsFromCSV();
      this.autoDetectTableName(); // 新增：自动检测表名
    },

    // 新增：自动检测表名方法
    autoDetectTableName() {
      // 使用文件名作为表名的基础
      let tableName = this.fileName;

      // 进行一些基本的清理和规范化
      tableName = tableName.toLowerCase()
          .replace(/\s+/g, '_')  // 将空格替换为下划线
          .replace(/[^a-z0-9_]/g, '')  // 移除非字母数字下划线字符
          .replace(/^[^a-z]+/, '');  // 确保表名以字母开头

      // 如果处理后的表名为空，使用默认名称
      if (!tableName) {
        tableName = 'imported_table';
      }

      // 更新 formData 中的表名
      this.formData.tableName = tableName;
    },

    cleanData() {
      // 实现数据清洗逻辑
      this.csvData = this.csvData.filter(row => Object.values(row).some(value => value !== ''));
    },

    handleMissingValues() {
      // 处理缺失值
      this.csvData = this.csvData.map(row => {
        Object.keys(row).forEach(key => {
          if (row[key] === '' || row[key] === undefined) {
            row[key] = null;
          }
        });
        return row;
      });
    },

    convertDataTypes() {
      // 数据类型转换
      this.csvData = this.csvData.map(row => {
        Object.keys(row).forEach(key => {
          if (!isNaN(row[key])) {
            row[key] = Number(row[key]);
          } else if (row[key] === 'true' || row[key] === 'false') {
            row[key] = row[key] === 'true';
          }
        });
        return row;
      });
    },

    normalizeFieldNames() {
      // 字段名规范化
      this.csvColumns = this.csvColumns.map(column =>
          column.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
      );
    },

    updateFieldsFromCSV() {
      this.formData.fields = this.csvColumns.map(column => ({
        name: column,
        type: this.guessFieldType(column, this.csvData),
        length: 255,
        comment: ''
      }));
    },
    // 表格设计优化
    optimizeTableDesign() {
      this.checkFieldNamingConventions();
      this.suggestIndexes();
      this.setPrimaryKey();
    },

    checkFieldNamingConventions() {
      // 实现字段命名规范检查
      const invalidFields = this.formData.fields.filter(field =>
          !field.name.match(/^[a-z][a-z0-9_]*$/)
      );
      if (invalidFields.length > 0) {
        this.$message.warning(`以下字段名不符合命名规范: ${invalidFields.map(f => f.name).join(', ')}`);
      }
    },

    suggestIndexes() {
      // 实现索引建议逻辑
      const potentialIndexFields = this.formData.fields.filter(field =>
          field.type === 'INT' || field.name.endsWith('_id') || field.name === 'created_at'
      );
      if (potentialIndexFields.length > 0) {
        this.$message.info(`建议为以下字段创建索引: ${potentialIndexFields.map(f => f.name).join(', ')}`);
      }
    },

    setPrimaryKey() {
      // 设置主键
      if (!this.formData.fields.some(field => field.name === 'id')) {
        this.formData.fields.unshift({
          name: 'id',
          type: 'INT',
          comment: '主键ID',
          isPrimaryKey: true
        });
        this.$message.info('已自动添加 id 字段作为主键');
      }
    },


    generateCreateTableSQL() {
      let sql = `CREATE TABLE IF NOT EXISTS \`${this.formData.tableName}\` (\n`;
      this.formData.fields.forEach((field, index) => {
        sql += `  \`${field.name}\` ${field.type}`;
        if (field.type === 'VARCHAR') sql += `(${field.length})`;
        if (field.isPrimaryKey) sql += ' PRIMARY KEY AUTO_INCREMENT';
        if (index < this.formData.fields.length - 1) sql += ',';
        sql += '\n';
      });
      sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${this.formData.tableComment}';`;
      return sql;
    },

    generateIndexSQL() {
      // 生成索引 SQL
      const indexFields = this.formData.fields.filter(field =>
          field.type === 'INT' || field.name.endsWith('_id') || field.name === 'created_at'
      );
      return indexFields.map(field =>
          `CREATE INDEX idx_${field.name} ON \`${this.formData.tableName}\` (\`${field.name}\`);`
      ).join('\n');
    },

    generateCommentSQL() {
      // 生成注释 SQL
      return this.formData.fields.filter(field => field.comment).map(field =>
          `ALTER TABLE \`${this.formData.tableName}\` MODIFY COLUMN \`${field.name}\` ${field.type} COMMENT '${field.comment}';`
      ).join('\n');
    },

    // 模拟数据生成
    generateMockData() {
      if (!this.tableCreated) {
        this.$message.warning('请先创建表格');
        return;
      }

      const insertDataSQL = this.generateInsertSQL();
      this.sqlResult = insertDataSQL;
      this.sqlDialogVisible = true;
    },

    generateMockDataForField(field) {
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
          return Math.random() > 0.5 ? 1 : 0;
        default:
          return 'NULL';
      }
    },

    generateInsertSQL() {
      const fieldNames = this.formData.fields.map(field => `\`${field.name}\``).join(', ');
      let insertSQL = `INSERT INTO \`${this.formData.tableName}\` (${fieldNames}) VALUES\n`;

      for (let i = 0; i < this.formData.generatedRows; i++) {
        const values = this.formData.fields.map(field => this.generateMockDataForField(field));
        insertSQL += `(${values.join(', ')})`;
        if (i < this.formData.generatedRows - 1) {
          insertSQL += ',\n';
        } else {
          insertSQL += ';';
        }
      }

      return insertSQL;
    },

    // 其他辅助方法
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
        {name: 'created_at', type: 'DATETIME', comment: '创建时间'},
        {name: 'updated_at', type: 'DATETIME', comment: '更新时间'}
      ];
      this.formData.fields.push(...commonFields);
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
      this.csvData = [];
      this.csvColumns = [];
      this.tableCreated = false;
      this.sqlGenerated = false;
    },

    copySqlResult() {
      navigator.clipboard.writeText(this.sqlResult).then(() => {
        this.$message.success('SQL 已复制到剪贴板');
      });
    },

    previewImportedData() {
      this.importedDataPreviewVisible = true;
    },

    generateRandomString(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
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


    async importFileData() {
      if (this.csvData.length === 0) {
        this.$message.warning('请先导入CSV文件');
        return;
      }

      if (!this.tableCreated) {
        this.$message.warning('请先创建表格');
        return;
      }

      // 打开字段选择对话框
      this.fieldSelectionDialogVisible = true;
    },

    confirmFieldSelection() {
      if (this.selectedFields.length === 0) {
        this.$message.warning('请至少选择一个字段进行导入');
        return;
      }

      // 验证选择的字段是否与表结构匹配
      const invalidFields = this.selectedFields.filter(field =>
          !this.formData.fields.some(tableField => tableField.name === field)
      );

      if (invalidFields.length > 0) {
        this.$message.error(`以下字段与表结构不匹配: ${invalidFields.join(', ')}`);
        return;
      }

      // 准备要发送的数据
      const importData = {
        tableName: this.formData.tableName,
        selectedFields: this.selectedFields,
        data: this.csvData.map(row =>
            this.selectedFields.reduce((acc, field) => {
              acc[field] = row[field];
              return acc;
            }, {})
        )
      };

      // 发送数据到后端
      this.sendImportDataToBackend(importData);
    },

    async sendImportDataToBackend(importData) {
      console.log('Sending data to backend:', JSON.stringify(importData, null, 2));
      try {
        const response = await axios.post('/api/import-file-data', importData);
        console.log('Response from backend:', response.data);
        this.$message.success('文件数据导入成功');
        this.fieldSelectionDialogVisible = false;
      } catch (error) {
        console.error('导入文件数据时出错:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        this.$message.error('导入文件数据失败: ' + (error.response?.data?.message || error.message));
      }
    },

    generateInsertSQLFromCSV() {
      const selectedFieldNames = this.selectedFields.map(field => `\`${field}\``).join(', ');
      let insertSQL = `INSERT INTO \`${this.formData.tableName}\` (${selectedFieldNames}) VALUES\n`;

      this.csvData.forEach((row, index) => {
        const values = this.selectedFields.map(field => {
          const value = row[field];
          if (value === null || value === undefined) {
            return 'NULL';
          } else if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`; // 转义单引号
          } else {
            return value;
          }
        });

        insertSQL += `(${values.join(', ')})`;
        if (index < this.csvData.length - 1) {
          insertSQL += ',\n';
        } else {
          insertSQL += ';';
        }
      });

      return insertSQL;
    },

    async executeSQL() {
      try {
        const response = await axios.post('/api/execute-sql', this.sqlResult, {
          headers: {
            'Content-Type': 'text/plain'
          }
        });
        this.$message.success(response.data);
        this.tableCreated = true;
        this.sqlDialogVisible = false;
        this.fieldSelectionDialogVisible = false;
      } catch (error) {
        console.error('SQL执行错误:', error);
        const errorMessage = error.response?.data || error.message || '未知错误';
        this.$message.error('SQL执行失败: ' + errorMessage);
      }
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