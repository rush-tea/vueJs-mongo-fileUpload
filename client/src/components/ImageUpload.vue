<template>
    <div class="mainContainer">
      <div class="heading">
        <h1>
          Image Upload
        </h1>
      </div>
      <div class="formContainer">
        <form @submit.prevent="onUpload" enctype="multipart/form-data">
        <div class="inputField">
            <input type="file" ref="file" id="fileInput" class="input-field" @change="onFileSelected">
        </div>
        <div class="formButton">
            <button>Upload</button>
        </div>
        </form>
      </div>
      <div class="imageContainer">
        <div v-for="(item,index) in imageData" v-bind:key="index" class="imageData">
          <img 
          v-bind:src="`http://localhost:4040/files/${item.filename}`" 
          alt="image"
          slot="image"
          />
        </div>
      </div>
    </div>        
</template>

<script>
import axios from 'axios';

export default {
  name: 'ImageUpload',
  data (){
    return{
      selectedFile: null,
      imageData: null
    }
  },
  created(){
    axios.get('http://localhost:4040/')
      .then((response) => {
      this.imageData = response.data.files;
      })
  },
  beforeUpdate(){
    axios.get('http://localhost:4040/')
      .then((response) => {
        this.imageData = response.data.files;
      })
  },
  methods: {
      onFileSelected(){
        this.selectedFile = this.$refs.file.files[0];
        console.log(this.selectedFile);
      },
      async onUpload(){
        const fd = new FormData();
        fd.append('file', this.selectedFile);
        console.log(fd);
        try {
          await axios.post('http://localhost:4040/upload',fd)
        } catch (error) {
          console.log(error);
        }
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mainContainer{
    width: 90%;
    margin: 50px auto 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .heading{
    padding: 20px;
  }
  .formContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .inputField{
    padding: 10px;
    border: 1px solid #d8d8d8;
  }
  .formButton{
    padding: 10px 0 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .formButton button{
    padding: 10px 15px 10px 15px;
    background: #f3f3f3;
    border: 1px solid #d8d8d8;
  }
  .btn-secondary{
    width: 100%;
  }
  .imageContainer{
    width: 70%;
  }
  .imageContainer img{
    padding: 20px;
    width: 100%;
  }
</style>
