<!-- Preview.vue -->
<template>
  <div class="preview-container">
    <div class="preview-content" v-html="previewContent">
    </div>
    <div class="preview-close" @click="closePreview">
      <span>关闭</span>
    </div>
  </div>
</template>

<script >

export default {
  methods: {
    closePreview() {
      this.$emit('close'); // 发送关闭预览事件
    }
  },
  props: {
    content: {
      content: String,
      type: String,
    }, // 定义一个名为previewUrl的prop，类型为String
  },
  computed: {
    // 根据文件类型，动态添加预览内容
    previewContent() {
      if (this.content.type === 'jpg' || this.content.type === 'png' || this.content.type === 'gif' || this.content.type === 'bmp' || this.content.type === 'jpeg') {
        return `<img src="${'data:image/png;base64,' + this.content.content}" alt="">`;
      } else if (this.content.type === 'mp4' || this.content.type === 'avi' || this.content.type === 'rmvb' || this.content.type === 'flv' || this.content.type === 'wmv') {
        return `<video style="width: 100%;height: 100%" src="${this.content.content}" controls></video>`;
      } else if (this.content.type === 'mp3' || this.content.type === 'wav' || this.content.type === 'wma' || this.content.type === 'ogg') {
        return `<audio src="${this.content.content}" controls></audio>`;
      } else if(this.content.type === 'txt') {
        return `<pre style="max-height: 100vh;overflow-y: scroll">${this.content.content}</pre>`;
      } else if(this.content.type === 'pdf') {
        return `<iframe src="${this.content.content}"  width="700" height="700" style="width: 100%;height: 100%"></iframe>`;
      } else if (this.content.type === 'doc' || this.content.type === 'docx') {
        //将this.content.content中的？替换成%3F，&替换成%26
        window.open(`https://view.xdocin.com/xdoc?_xdoc=${this.content.content.replace(/\?/g, '%3F').replace(/&/g, '%26')}`);
        this.closePreview()
      } else if (this.content.type === 'xls' || this.content.type === 'xlsx') {
        return `<iframe src="${this.content.content}" frameborder="0" width="100%" height="100%"></iframe>`;
      } else if (this.content.type === 'ppt' || this.content.type === 'pptx') {
        return `<iframe src="${this.content.content}" frameborder="0" width="100%" height="100%"></iframe>`;
      } else {
        return `<div style="width: 400px;height: 400px">暂不支持该文件类型的预览</div>`;
      }
    },
  },
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background: #f5f5f5;
}
.preview-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.preview-content {
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  background: white;
}

.preview-close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: black;
}
.preview-close svg {
  fill: #000;
}
</style>



