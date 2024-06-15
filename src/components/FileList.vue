<template>
    <div>
      <a-page-header title="我的数据">
        <a-button type="primary" icon="upload" size="small" style="margin-right: 8px;" @click="showUploadModal">上传数据</a-button>
        <a-input-search
          v-model="searchText"
          placeholder="输入数据名"
          enter-button
          @search="onSearch"
          size="small"
          style="width: 200px; margin: 16px 0;"
        />
        <a-table :columns="columns" :dataSource="data" rowKey="key" pagination="{ pageSize: 10 }">
          <span slot="operation" slot-scope="text, record">
            <a-button type="link" @click="view(record)" size="small">预览</a-button>
            <a-button type="link" @click="explain(record)" size="small">说明</a-button>
            <a-button type="link" @click="copy(record)" size="small">复制</a-button>
            <a-button type="link" @click="save(record)" size="small">存证</a-button>
            <a-button type="link" @click="editField(record)" size="small">编辑字段</a-button>
            <a-button type="link" @click="pin(record)" size="small">置顶</a-button>
            <a-button type="link" @click="remove(record)" size="small" style="color: red;">删除</a-button>
          </span>
        </a-table>
  
        <!-- Upload Modal -->
        <a-modal title="文件上传" v-model="uploadModalVisible" @ok="handleUpload" @cancel="handleCancel">
          <a-form>
            <a-form-item label="文件名">
              <a-input v-model="fileName" placeholder="请输入文件名" />
            </a-form-item>
            <a-form-item label="上传">
              <a-upload
                multiple
                :before-upload="beforeUpload"
                :file-list="fileList"
                @change="handleChange"
              >
                <a-button>
                  <a-icon type="upload" /> 添加文件
                </a-button>
              </a-upload>
            </a-form-item>
            <p>请勿上传违法文件，清云环境带宽有限，限制文件大小小于50KB</p>
          </a-form>
        </a-modal>
      </a-page-header>
      <!-- <img src="" alt="Uploaded Image" style="margin-top: 16px; width: 100%; height: auto;"> -->
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchText: '',
        uploadModalVisible: false,
        fileName: '',
        fileList: [],
        columns: [
          { title: '序号', dataIndex: 'key', key: 'key' },
          { title: '名称', dataIndex: 'fileName', key: 'fileName' },
          { title: '说明', dataIndex: 'description', key: 'description' },
          { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime' },
          { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } },
        ],
        data: [
          { key: '1', fileName: 'device', description: 'device', uploadTime: '2024-06-14 10:22:18' },
          // 这里可以添加更多数据
        ],
      };
    },
    methods: {
      showUploadModal() {
        this.uploadModalVisible = true;
      },
      handleUpload() {
        if (this.fileList.length > 0) {
          this.fileName = this.fileList.map(file => file.name).join(', ');
        }
        console.log('Files:', this.fileList);
        console.log('File Name:', this.fileName);
        this.uploadModalVisible = false;
      },
      handleCancel() {
        this.uploadModalVisible = false;
      },
      beforeUpload(file) {
        const isLt50KB = file.size / 1024 < 50;
        if (!isLt50KB) {
          this.$message.error('文件大小需小于 50KB!');
        }
        return isLt50KB;
      },
      handleChange({ fileList }) {
        this.fileList = fileList;
      },
      onSearch(value) {
        console.log('Search:', value);
      },
      view(record) {
        console.log('View:', record);
      },
      explain(record) {
        console.log('Explain:', record);
      },
      copy(record) {
        console.log('Copy:', record);
      },
      save(record) {
        console.log('Save:', record);
      },
      editField(record) {
        console.log('Edit Field:', record);
      },
      pin(record) {
        console.log('Pin:', record);
      },
      remove(record) {
        this.data = this.data.filter(item => item.key !== record.key);
        console.log('Delete:', record);
      },
    },
  };
  </script>
  
  <style scoped>
  .ant-table {
    margin-top: 16px;
  }
  </style>
  